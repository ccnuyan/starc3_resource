# 云存储及文件、资源服务
**Version:0.0.1**

## 需求
### 基础
- 服务状态及版本查询

### 基础服务
- 服务状态及版本查询

```
GET(/service/status)

STATUS:200
ok
```

### 网盘服务
- 获取根目录信息

```
GET(/disk/root)

STATUS:200
{
  "_id": "56ce72da9b61a997fd9356af",
  "user": "56ce72da9b61a997fd9356ae",
  "depth": 0,
  "__v": 0,
  "subFiles": [],
  "subDirectories": [],
  "name": "root",
  "created": "2016-02-25T03:19:54.732Z"
}
```

- 创建子目录

```
POST('/disk/dir/:parentId/subdir/')
{
  "name": 'valid name'
}

STATUS:201
{
  "__v": 0,

  "parent": "56ce764d909b96556356929b",
  "depth": 1,
  "user": "56ce764c909b96556356929a",
  "_id": "56ce764d909b96556356929c",
  "subFiles": [],
  "subDirectories": [],
  "name": "valid name",
  "created": "2016-02-25T03:34:37.117Z"
}
```

- 创建二级子目录`[同上]`
- 重命名目录

```
PUT('/disk/dir/:parentId/subdir/:directoryId')
{
  "name": 'valid name'
}

STATUS:200
{
  "_id": "56ce81208e129b7924c376cd",
  "parent": "56ce81208e129b7924c376ca",
  "depth": 1,
  "user": "56ce81208e129b7924c376c9",
  "__v": 0,
  "subFiles": [],
  "subDirectories": [],
  "name": "new name",
  "created": "2016-02-25T04:20:48.702Z"
}
```

- 删除目录

```
DELETE('/disk/dir/:parentId/subdir/:directoryId')

STATUS:200
{
  "_id": "56ce81208e129b7924c376cd",
  "parent": "56ce81208e129b7924c376ca",
  "depth": 1,
  "user": "56ce81208e129b7924c376c9",
  "__v": 0,
  "subFiles": [],
  "subDirectories": [],
  "name": "new name",
  "created": "2016-02-25T04:20:48.702Z"
}
```

- 获取目录内容

```
GET('/disk/dir/56ce8b259540100f5584e993/subdir/')

STATUS:200
{
  "_id": "56ce8b259540100f5584e993",
  "user": "56ce8b259540100f5584e992",
  "depth": 0,
  "__v": 1,
  "subFiles": [],
  "subDirectories": [
    {
      "_id": "56ce8b259540100f5584e994",
      "parent": "56ce8b259540100f5584e993",
      "depth": 1,
      "user": "56ce8b259540100f5584e992",
      "__v": 0,
      "subFiles": [],
      "subDirectories": [],
      "name": "valid name",
      "created": "2016-02-25T05:03:33.315Z"
    }
  ],
  "name": "root",
  "created": "2016-02-25T05:03:33.290Z"
}
```

- 获取网盘所有文件`[to be continued ...]`
- 条件搜索网盘文件`[to be continued ...]`
- 小文件一次性上传

```
POST('/request/upload/dir/:parentId/subfile/')

STATUS 201
{
  _id:'transactionid'
}

then

FORM UPLOAD(uploader/api/upload/+transactionid)
STATUS 200
{
  "__v": 0,
  "name": "file.txt",
  "fileObject": {
    "__v": 0,
    "extension": ".txt",

    "name": "file.txt",
    "etag": "etagid",
    "storage_object_id": "storage_object_id",
    "storage_box_id": "storage_box_id",
    "user": "56ce97a750a88c171974b674",
    "_id": "56ce97a850a88c171974b678",
    "created": "2016-02-25T05:56:56.185Z",
    "contentType": "text/plain",
    "size": 100
  },
  "user": "56ce97a750a88c171974b674",
  "_id": "56ce97a850a88c171974b679",
  "created": "2016-02-25T05:56:56.186Z",
  "parent": "56ce97a850a88c171974b675"
}
```

- 大文件分块分片上传 `［PS：非断点续传］`
- 文件删除

```
DELETE('/dir/:parentId/subfile/:fileId')
STATUS 200
{
  "__v": 0,
  "name": "file.txt",
  "fileObject": {
    "__v": 0,
    "extension": ".txt",

    "name": "file.txt",
    "etag": "etagid",
    "storage_object_id": "storage_object_id",
    "storage_box_id": "storage_box_id",
    "user": "56ce97a750a88c171974b674",
    "_id": "56ce97a850a88c171974b678",
    "created": "2016-02-25T05:56:56.185Z",
    "contentType": "text/plain",
    "size": 100
  },
  "user": "56ce97a750a88c171974b674",
  "_id": "56ce97a850a88c171974b679",
  "created": "2016-02-25T05:56:56.186Z",
  "parent": "56ce97a850a88c171974b675"
}
```

- 文件重命名

```
PUT('/dir/:parentId/subfile/:fileId')
{
  "name":"newname"
}
STATUS 200
{
  "__v": 0,
  "name": "file.txt",
  "fileObject": {
    "__v": 0,
    "extension": ".txt",

    "name": "file.txt",
    "etag": "etagid",
    "storage_object_id": "storage_object_id",
    "storage_box_id": "storage_box_id",
    "user": "56ce97a750a88c171974b674",
    "_id": "56ce97a850a88c171974b678",
    "created": "2016-02-25T05:56:56.185Z",
    "contentType": "text/plain",
    "size": 100
  },
  "user": "56ce97a750a88c171974b674",
  "_id": "56ce97a850a88c171974b679",
  "created": "2016-02-25T05:56:56.186Z",
  "parent": "56ce97a850a88c171974b675"
}
```

- 文件下载

```
POST('/request/upload/dir/:parentId/subfile/')

STATUS 201
{
  _id:'transactionid'
}

then

GET(uploader/api/download/+transactionid)
STATUS 200
```

- 文件移动

```
POST('/move/:fileId/from/:sourceDirectoryId/to/:targetDirectoryId')

STATUS 200
{
  "source": {
    "_id": "56cea2485540382fe2dab420",
    "user": "56cea2485540382fe2dab41f",
    "depth": 0,
    "__v": 3,
    "subFiles": [],
    "subDirectories": [
      {
        "_id": "56cea2485540382fe2dab421",
        "parent": "56cea2485540382fe2dab420",
        "depth": 1,
        "user": "56cea2485540382fe2dab41f",
        "__v": 0,
        "subFiles": [
          "56cea2485540382fe2dab424"
        ],
        "subDirectories": [],
        "name": "valid name 1",
        "created": "2016-02-25T06:42:16.177Z"
      },
      {
        "_id": "56cea2485540382fe2dab422",
        "parent": "56cea2485540382fe2dab420",
        "depth": 1,
        "user": "56cea2485540382fe2dab41f",
        "__v": 0,
        "subFiles": [],
        "subDirectories": [],
        "name": "valid name 2",
        "created": "2016-02-25T06:42:16.197Z"
      }
    ],
    "name": "root",
    "created": "2016-02-25T06:42:16.157Z"
  },
  "target": {
    "_id": "56cea2485540382fe2dab421",
    "parent": "56cea2485540382fe2dab420",
    "depth": 1,
    "user": "56cea2485540382fe2dab41f",
    "__v": 0,
    "subFiles": [
      {
        "_id": "56cea2485540382fe2dab424",
        "name": "file.txt",
        "fileObject": "56cea2485540382fe2dab423",
        "user": "56cea2485540382fe2dab41f",
        "__v": 0,
        "created": "2016-02-25T06:42:16.216Z",
        "parent": "56cea2485540382fe2dab421"
      }
    ],
    "subDirectories": [],
    "name": "valid name 1",
    "created": "2016-02-25T06:42:16.177Z"
  },
  "file": {
    "_id": "56cea2485540382fe2dab424",
    "name": "file.txt",
    "fileObject": {
      "_id": "56cea2485540382fe2dab423",
      "extension": ".txt",
      "name": "file.txt",
      "etag": "etagid",
      "storage_object_id": "storage_object_id",
      "storage_box_id": "storage_box_id",
      "user": "56cea2485540382fe2dab41f",
      "__v": 0,
      "created": "2016-02-25T06:42:16.216Z",
      "contentType": "text/plain",
      "size": 100
    },
    "user": "56cea2485540382fe2dab41f",
    "__v": 0,
    "created": "2016-02-25T06:42:16.216Z",
    "parent": "56cea2485540382fe2dab421"
  }
}
```

- 文件预览`[to be continued ...]`

### 资源服务
- 直接发布资源
- 修改已发布的资源
- 删除已发布的资源
- 资源下载计数
- 资源的条件搜索
- 另外ElasticSearch还有大量工作需要做

### 知识点服务
- 知识点的导入
- 知识点的编辑[A]

## 技术方案
- 数据库:Mongodb
- 服务:Express
- 服务建构:Gulp
- 服务测试方案:mocha + supertest
- 前端:React+Redux+immutable.js
- 前端建构:webpack
- 前端测试:待定
- 服务部署:Docker+Ubuntu

## API
to be updated ...
