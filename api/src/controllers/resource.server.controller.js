var conf = require('../config/config').getConfig();
var mongoose = require('mongoose');
var FileObject = mongoose.model('FileObject');
var RemovedFileObject = mongoose.model('RemovedFileObject');
var Resource = mongoose.model('Resource');

var client = require('../services/elasticSearchService.js').getClient();

var Excel = require('exceljs');

var cloudBox = conf.openStackConfig.cloudBox;
var tempBox = conf.openStackConfig.temp;

exports.search = function (req, res, next) {

    //SQL -- ES
    //schema -- mappings
    //database -- index
    //table -- type
    //column -- property

    var perPage = req.query.perPage || 10;
    var page = req.query.page || 1;
    var matches = [];

    var searchParams = {};

    matches.push({match: {title: req.query.term}});
    matches.push({match: {description: req.query.term}});
    matches.push({match: {knowledgeNode: req.query.term}});

    searchParams.dis_max = {queries: matches};

    var filter = {and: []};
    var filterFlag = false;

    // deprecated
    // if (req.query.resourceType) {
    //     filterFlag = true;
    //     filter.and.push({term: {resourceType: req.query.resourceType}});
    // }

    if (req.query.subject) {
        filterFlag = true;
        filter.and.push({term: {subjectId: req.query.subject}});
    }

    if (req.query.knowledgeNode) {
        filterFlag = true;
        filter.and.push({term: {knowledgeNodeId: req.query.knowledgeNode}});
    }

    var searchBody = {
        from: perPage * (page - 1),
        size: perPage,
        fields: [],
        query: searchParams
    };

    if (filterFlag) {
        searchBody.filter = filter;
    }

    client.search({
        index: 'starc3_resource',
        type: 'resources',
        body: searchBody
    }, function (error, response) {

        if (error) {
            return next({message: 'search engine down'});
        }

        var ids = [];

        if (response && !response.timeout) {

            response.hits.hits.forEach(function (hit) {
                ids.push(hit._id);
            });

            Resource.find({_id: {$in: ids}})
                .populate('knowledgeNode')
                // .populate('fileObject')
                .sort({approved: 'desc'})
                .exec(function (err, resources) {
                    if (err) {
                        return next({db: err});
                    }

                    var orderdResources = [];
                    ids.forEach(function (id) {
                        resources.forEach(function (node) {
                            if(node._id.toString() === id.toString()){
                                orderdResources.push(node);
                            }
                        });
                    });

                    return res.status(200).json({
                        page: page,
                        pages: response.hits.total / perPage,
                        total: response.hits.total,
                        resources: orderdResources
                    });
                });
        } else {
            return next({message: 'search engine down'});
        }
    });
};

exports.list = function (req, res, next) {

    var user = req.user;

    var perPage = req.query.perPage || 10;
    var page = req.query.page || 1;

    var condition = {user: user.id};

    if (req.query.status) {
        condition.status = req.query.status;
    }

    Resource.find(condition)
        .limit(perPage)
        .populate('knowledgeNode')
        .populate('fileObject')
        .skip(perPage * (page - 1))
        .sort({
            approved: 'desc'
        })
        .exec(function (err, resources) {
            if (err) {
                return next({db: err});
            }

            Resource.count(condition).exec(function (err, count) {
                res.status(200).json({
                    page: page,
                    pages: count / perPage,
                    total: count,
                    resources: resources
                });
            });
        });
};

exports.rsAdminList = function (req, res, next) {
    var perPage = req.query.perPage || 10;
    var page = req.query.page || 1;

    var condition = {};

    if (!req.query.status || req.query.status === 'submitted') {
        condition.status = 'submitted';
    } else {
        condition.status = req.query.status;
        condition.user = req.user.id;
    }

    Resource.find(condition)
        .limit(perPage)
        .populate('knowledgeNode')
        .populate('fileObject')
        .skip(perPage * (page - 1))
        .sort({approved: 'asc'})
        .exec(function (err, resources) {
            if (err) {
                return next({db: err});
            }
            Resource.count(condition).exec(function (err, count) {
                if (err) {
                    return next({db: err});
                }
                res.status(200).json({
                    page: page,
                    pages: count / perPage,
                    total: count,
                    resources: resources
                });
            });
        });
};

exports.resourcesSiteInfo = function (req, res, next) {

    var info = {};

    Resource.find({status: 'approved'})
        .limit(10)
        .populate('knowledgeNode')
        .populate('fileObject')
        .sort({approved: 'desc'})
        .exec(function (err, ret) {
            if (err) {
                return next({db: err});
            }
            info.resources = ret;

            Resource.count({status: 'approved'})
                .exec(function (err, count) {
                    info.count = count;
                    res.status(200).json(info);
                });
        });
};

exports.decision = function (req, res, next) {
    var resource = req.resource;

    if (resource.status === 'submitted') {
        if (req.body.status === 'rejected') {
            var update1 = {
                $set: {
                    status: 'rejected',
                    approved: null,
                    feedback: req.body.feedback,
                    reviewer: req.user
                }
            };

            Resource.findByIdAndUpdate(resource._id, update1)
                .populate('knowledgeNode')
                .populate('fileObject')
                .exec(function (err, retResource) {
                    if (err) {
                        return next({db: err});
                    }
                    return res.status(200).json(retResource);
                }
            );
        } else if (req.body.status === 'approved') {

            var update2 = {
                $set: {
                    status: 'approved',
                    approved: Date.now(),
                    feedback: '',
                    reviewer: req.user
                }
            };

            Resource.findByIdAndUpdate(resource._id, update2)
                .populate('knowledgeNode')
                .populate('fileObject')
                .exec(function (err, retResource) {
                    if (err) {
                        return next({db: err});
                    }
                    return res.status(200).json(retResource);
                }
            );

        }
        else {
            return next({message: 'you should decide to reject or approve this resource'});
        }
    } else {
        return next({message: 'not allowed'});
    }
};

exports.edit = function (req, res, next) {
    var resource = req.resource;
    if (resource.status === 'submitted' || resource.status === 'rejected') {

        var update = {
            $set: {
                description: req.body.description,
                status: 'submitted'
            }
        };


        resource.description = req.body.description;
        resource.status = 'submitted';


        resource.save(function (err, ret) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(ret);
        });
    }
    else {
        return next({message: 'not allowed'});
    }
};

var publishResource = function (req, res, next, container, sourceFileObject) {
    var resource = new Resource();

    //如果是admin发布，则不需要审核
    if (req.user.roles.indexOf('resourceAdmin') >= 0) {
        resource.status = 'approved';
    }

    resource.user = req.user;
    resource.title = req.body.title;
    resource.res_coverage = req.body.coverage;
    resource.knowledgeNode = req.body.knowledgeNode;
    resource.description = req.body.description;
    resource.res_type = req.body.res_type;

    if (sourceFileObject) {
        resource.res_meta_type = 'file';
        var fObj = sourceFileObject.toObject();
        delete fObj._id;
        var fileObject = new FileObject(fObj);

        swiftInitializer.init(function (err, swift) {
                if (err) {
                    return next({message: 'cloud storage error'});
                }
                swift.copyObject(cloudBox, fileObject._id, container, sourceFileObject._id, function (opsErr, opsRet) {
                    if (opsErr || opsRet.statusCode !== 201) {
                        return next({message: 'cloud storage copy object error'});
                    }
                    fileObject.save(function (err, fileObjectRet) {
                        if (err) {
                            return next({db: err});
                        }

                        resource.title = resource.title ? resource.title : fileObjectRet.name;
                        resource.fileObject = fileObjectRet;
                        resource.save(function (err, retRes) {
                            if (err) {
                                return next({db: err});
                            }
                            return res.status(201).json(retRes);
                        });
                    });
                });
            }
        );
    } else {
        resource.res_meta_type = 'link';
        resource.res_link = {
            uri: req.body.uri
        };
        resource.res_type = 'link';
        resource.save(function (err, retRes) {
            if (err) {
                return next({db: err});
            }
            return res.status(201).json(retRes);
        });
    }
};

exports.createByFile = function (req, res, next) {

    var fileObject = req.file.fileObject;
    fileObject.usage = 'resource';

    publishResource(req, res, next, cloudBox, fileObject);
};

exports.createByTempFile = function (req, res, next) {

    var tempFileObject = req.tempFileObject;
    tempFileObject.usage = 'resource';

    publishResource(req, res, next, tempBox, tempFileObject);
};

exports.createByLink = function (req, res, next) {

    publishResource(req, res, next);
};

exports.import = function (req, res, next) {

    if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return next({message: 'only *.xlsx file allowed here'});
    }

    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(req.file.path)
        .then(function () {
            if (workbook._worksheets[1]._rows.length === 0) {
                return res.json([]);
            }

            var retData = [];

            var callback = function (retRes, flag) {

                var resUnit = retRes.toObject();

                resUnit.flag = flag;

                retData.push(resUnit);

                if (workbook._worksheets[1]._rows.length === retData.length) {
                    return res.json(retData);
                }
            };


            workbook._worksheets[1]._rows.forEach(function (resCell) {
                var resource = new Resource();

                if (req.user.roles.indexOf('resourceAdmin') >= 0) {
                    resource.status = 'approved';
                }

                resource.user = req.user;
                resource.res_meta_type = 'link';
                resource.title = resCell._cells[0] ? resCell._cells[0]._value.model.value : null;
                resource.description = resCell._cells[1] ? resCell._cells[1]._value.model.value : null;

                resource.res_link = {
                    uri: resCell._cells[2] ? resCell._cells[2]._value.model.value : null
                };
                if (resCell._cells[3])resource.res_coverage = resCell._cells[3]._value.model.value;
                if (resCell._cells[4])resource.res_type = resCell._cells[4]._value.model.value;
                if (resCell._cells[5])resource.knowledgeNode = resCell._cells[5]._value.model.value;

                if (!resource.res_link.uri) {
                    callback(resource, false);
                }
                else {
                    resource.save(function (err) {
                        if (err) {
                            callback(resource, false);
                        }
                        else {
                            callback(resource, true);
                        }
                    });
                }
            });
            res.status(200);
        });
};

exports.delete = function (req, res, next) {
    var resource = req.resource;
    var fileObject = req.resource.fileObject;

    resource.remove(function (err) {
        if (err) {
            return next({db: err});
        } else {

            resource.remove();
            fileObject.remove();
            var removedFile = new RemovedFileObject(fileObject.toObject());
            removedFile.save();

            return res.status(200).json(resource);
        }
    });
};

exports.download = function (req, res, next) {

    var resource = req.resource;

    if (resource.res_meta_type !== 'file') {
        return next({message: 'downloading is not allowed for this resource meta type'});
    }

    res.attachment(resource.fileObject.name);

    swiftInitializer.init(function (err, swift) {
        if (err) {
            return next({message: 'cloud storage error'});
        }

        swift.getFile(cloudBox, resource.fileObject.id, function (err) {
            if (err) {
                return next({message: 'cloud storage get file error'});
            } else {
                return res.status(200).send();
            }
        }, res);
    });
};

exports.edit = function (req, res, next) {
    var resource = req.resource;
    if (resource.status === 'submitted' || resource.status === 'rejected') {

        var status = 'submitted';

        //如果是admin发布，则不需要审核
        if (req.user.roles.indexOf('resourceAdmin') >= 0) {
            status = 'approved';
        }

        var update = {
            $set: {
                description: req.body.description,
                status: status
            }
        };

        Resource.findByIdAndUpdate(resource._id, update)
            .populate('knowledgeNode')
            .populate('fileObject')
            .exec(function (err, retResource) {
                if (err) {
                    return next({db: err});
                }
                return res.status(200).json(retResource);
            }
        );
    }
    else {
        return next({message: 'resource status : ' + req.resource.statu});
    }
};

exports.mark = function (req, res, next) {
    var resource = req.resource;
    return next({message: 'resource mark : not implemented'});
};

exports.downloadHit = function (req, res, next) {
    var resource = req.resource;
    Resource.findByIdAndUpdate(resource._id, {$inc: {downloads: 1}})
        .populate('fileObject')
        .exec(function (err, resource) {
            if (err) {
                return next({db: err});
            }
            return res.status(200).json(resource);
        });
};

exports.resourceByID = function (req, res, next, id) {
    Resource.findById(id)
        .populate('knowledgeNode')
        .populate('fileObject')
        .exec(function (err, resource) {
            if (err) {
                return next({db: err});
            }
            if (!resource) {
                return next({message: 'resource specified does not exist'});
            }

            req.resource = resource;
            return next();
        });
};
