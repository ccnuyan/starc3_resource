var INDEX = 'starc3_resource';
var KNOWLEDGENODE_TYPE = 'knowledgeNodes';
var RESOURCES_TYPE = 'resources';

module.exports = {
  knowledgeNodes: {
    ignoreConflicts: true,
    timeout: 1000000,
    masterTimeout: 1000000,
    index: INDEX,
    type: KNOWLEDGENODE_TYPE,
    body: {
      knowledgeNodes: {
        _all: {
          enabled: false
        },
        _source: {
          enabled: true
        },
        properties: {
          subject: {
            type: 'string',
            analyzer: 'ik',
          },
          title: {
            type: 'string',
            analyzer: 'ik',
          }
        }
      }
    }
  },
  resources: {
    ignoreConflicts: true,
    timeout: 1000000,
    masterTimeout: 1000000,
    index: INDEX,
    type: RESOURCES_TYPE,
    body: {
      resources: {
        _all: {
          enabled: false
        },
        _source: {
          enabled: true
        },
        properties: {
          subjectId: {
            type: 'string',
          },
          knowledgeNodeId: {
            type: 'string',
          },
          knowledgeNode: {
            type: 'string',
            analyzer: 'ik',
          },
          title: {
            type: 'string',
            analyzer: 'ik',
          },
          description: {
            type: 'string',
            analyzer: 'ik',
          }
        }
      }
    }
  }
};
