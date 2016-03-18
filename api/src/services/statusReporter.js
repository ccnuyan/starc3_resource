var jwt = require('jwt-simple');
var conf = require('../config/config').getConfig();

var Response = function(status, message) {
  return {
    status: status,
    message: message
  };
};

var success = function(res) {
  res.status(200).send(Response('success', '成功'));
};

var parentNotExisted = function(res) {
  res.status(400).send(Response('failure', '父目录不存在'));
};

var directoryNotExisted = function(res) {
  res.status(400).send(Response('failure', '目录不存在'));
};

var sourceNotExisted = function(res) {
  res.status(400).send(Response('failure', '源目录不存在'));
};

var targetNotExisted = function(res) {
  res.status(400).send(Response('failure', '目标目录不存在'));
};

var fileNotExisted = function(res) {
  res.status(400).send(Response('failure', '文件不存在'));
};

var directoryNameIlligal = function(res) {
  res.status(400).send(Response('failure', '这个目录名不合法'));
};

var fileNameIlligal = function(res) {
  res.status(400).send(Response('failure', '这个文件名不合法'));
};

var fileExtensionNotExisted = function(res) {
  res.status(400).send(Response('failure', '文件扩展名不存在, 拒绝上传'));
};


var authenticationFailed = function(res) {
  res.status(401).send(Response('failure', '未授权'));
};

var notAllowed = function(res) {
  res.status(401).send(Response('failure', '不允许这样做'));
};

var notAllowedToCreateDeeperDirectory = function(res) {
  res.status(400).send(Response('failure', '不允许创建更深层次的文件夹'));
};

var notAllowedToModifyFileExtension = function(res) {
  res.status(400).send(Response('failure', '不允许修改文件扩展名'));
};



module.exports = {
  success: success,
  parentNotExisted: parentNotExisted,
  directoryNotExisted: directoryNotExisted,
  sourceNotExisted: sourceNotExisted,
  targetNotExisted: targetNotExisted,
  fileNotExisted: fileNotExisted,
  directoryNameIlligal: directoryNameIlligal,
  fileNameIlligal: fileNameIlligal,
  fileExtensionNotExisted: fileExtensionNotExisted,
  authenticationFailed: authenticationFailed,
  notAllowed: notAllowed,
  notAllowedToModifyFileExtension:notAllowedToModifyFileExtension,
  notAllowedToCreateDeeperDirectory:notAllowedToCreateDeeperDirectory,
};
