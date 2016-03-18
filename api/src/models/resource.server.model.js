var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//DC CORE
//1．Title（标题）：资源的名称；
//2．Creator（创建者）：资源的创建者；
//3．Subject（主题）：资源的主题内容；
//4．Description（描述）：资源的内容、介绍信息；
//5．Publisher（出版者）：正式发布资源的实体；
//6．Contributor（贡献人）：资源生存期中作出贡献的实体；
//7．Date（日期）：资源生存周期中的一些重大日期；
//8．Type（类型）：资源所属的类别；
//9．Format（格式）：资源的物理或数字表现；
//10．Identifier（标识符）：关开资源的唯一标识；
//11．Source（源信息）：资源的来源；
//12．Language（语言）：资源的语言类型；
//13．Relation（关联）：与其它资源的索引关系；
//14．Coverage（覆盖范围）：资源应用的范围；
//15．Rights（权限）：使用资源的权限信息。

//1、媒体素材(Media material)
//媒体素材是传播教学信息的基本材料单元，可分为五大类：文本类素材(text)、图形（图像）类素材(picture)、音频类素材(audio)、视频类素材(video)、动画类素材(animation)。
//2、题库(Item bank)
//3、课件(Courseware)
//4、案例(Case)
//案例是指有现实指导意义和教学意义的代表性的事件或现象。
//5、文献资料(Literature)
//6、网络课程(Network course)
//7、常见问题解答(Frequently asked questions)
//常见问题解答是针对某一具体领域最常出现的问题给出全面的解答。
//8、资源目录索引(Resource index)
//列出某一领域中相关的网络资源地址链接和非网络资源的索引。

var ResourceSchema = new Schema({

  res_meta_type: {
    type: String,
    enum: ['file', 'link'],
    default: 'file'
  },

  linkObject: {
    uri: {
      type: String,
      trim: true
    }
  },

  fileObject: {
    type: Schema.ObjectId,
    ref: 'FileObject'
  },

  title: {
    type: String,
    trim: true,
    required: true
  },

  description: {
    type: String,
    trim: true,
    required: true
  },

  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },

  reviewer: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  approved: {
    type: Date,
    default: Date.now
  },

  supports: {
    type: Number,
    default: 0
  },

  tramples: {
    type: Number,
    default: 0
  },

  downloads: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    required: true,
    default: 'approved',
    enum: ['submitted', 'approved', 'rejected']
  },

  feedback: {
    type: String
  },

  knowledgeNode: {
    type: Schema.ObjectId,
    ref: 'KnowledgeNode'
  },

  res_coverage: {
    type: String,
    trim: true
  },

  res_type: {
    type: String,
    trim: true,
    enum: [
      'media_material',
      'item_bank',
      'courseware',
      'case',
      'literature',
      'network_course',
      'frequently_asked_questions',
      'resource_index'
    ]
  }
});

ResourceSchema.path('res_meta_type').validate(function(value) {
  if (value === 'link')
    return this.linkObject === null && this.linkObject.uri === null;
  if (value === 'file')
    return this.fileObject !== null;
  return true;
}, 'linkObject or fileObject of this resource can not be null');

module.exports = function() {
  mongoose.model('Resource', ResourceSchema);
};
