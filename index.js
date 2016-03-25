var request = require('request');
var baseUrl          = 'https://metamaps.herokuapp.com/api/v1',
    topicCreateUrl   = baseUrl + '/topics',
    synapseCreateUrl = baseUrl + '/synapses',
    mappingCreateUrl = baseUrl + '/mappings',
    mapCreateUrl     = baseUrl + '/maps',
    mapUrl           = baseUrl + '/maps/:id'; 

var toExport = {
  addTopicToMap: function (mapId, topic, x, y, token, callback) {
    topic.permission = topic.permission || 'commons';
    request.post({
      url: topicCreateUrl,
      form: {
        access_token: token,
        topic: topic
      }
    }, function (err, response, body) {
      if (err || response.statusCode > 200) {
        console.log(err || 'statusCode: ' + response.statusCode);
        console.log('body: ', body);
        return callback('topic failed');
      }
      var body = JSON.parse(body);
      var topic = body.topics[0];
      var mapping = {
        mappable_id: topic.id,
        mappable_type: 'Topic',
        map_id: mapId,
        xloc: x || randomCoord(),
        yloc: y || randomCoord()
      };
      request.post({
        url: mappingCreateUrl,
        form: {
          access_token: token,
          mapping: mapping
        }
      }, function (err, response, body) {
        if (err || response.statusCode > 200) {
          console.log(err || 'statusCode: ' + response.statusCode);
          console.log('body: ', body);
          return callback('mapping failed');
        }
        var body = JSON.parse(body);
        callback(null, topic);
      });
    });
  },
  addSynapseToMap: function (mapId, synapse, token, callback) {
    synapse.permission = synapse.permission || 'commons';
    request.post({
      url: synapseCreateUrl,
      form: {
        access_token: token,
        synapse: synapse
      }
    }, function (err, response, body) {
      if (err || response.statusCode > 200) {
        console.log(err || 'statusCode: ' + response.statusCode);
        console.log('body: ', body);
        return callback('synapse failed');
      }
      var body = JSON.parse(body);
      var synapse = body.synapses[0];
      var mapping = {
        mappable_id: synapse.id,
        mappable_type: 'Synapse',
        map_id: mapId
      };
      request.post({
        url: mappingCreateUrl,
        form: {
          access_token: token,
          mapping: mapping
        }
      }, function (err, response, body) {
        if (err || response.statusCode > 200) {
          console.log(err || 'statusCode: ' + response.statusCode);
          console.log('body: ', body);
          return callback('mapping failed');
        }
        callback(null, synapse);
      });
    });
  },
  getMap: function (id, token, callback) {
    request.get({
      url: mapUrl + id + '?access_token=' + token
    }, function (err, response, body) {
      if (err || response.statusCode > 200) {
        console.log(err || 'statusCode: ' + response.statusCode);
        console.log('body: ', body);
        return callback(err);
      }
      var body = JSON.parse(body);
      callback(null, body.maps[0]);
    });
  },
  createMap: function (map, token, callback) {
    request.post({
      url: mapCreateUrl,
      form: {
        access_token: token,
        map: map
      }
    }, function (err, response, body) {
      if (err || response.statusCode > 200) {
        console.log(err || 'statusCode: ' + response.statusCode);
        console.log('body: ', body);
        return callback('creating map failed');
      }
      var body = JSON.parse(body);
      callback(null, body.maps[0]);
    });
  }
}

module.exports = toExport; 
