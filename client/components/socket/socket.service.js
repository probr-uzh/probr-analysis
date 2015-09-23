/* global io */
'use strict';

angular.module('probrAnalysisApp')
    .factory('Socket', function ($injector, socketFactory, Auth) {

        // socket.io now auto-configures its connection when we ommit a connection url
        var ioSocket = io('', {
            //query: 'token=' + Auth.getToken(),
            path: '/socket.io-client'
        });

        var socket = socketFactory({
            ioSocket: ioSocket
        });

        return {
            socket: socket,

            listenTo: function (eventName, cb) {
                cb = cb || angular.noop;

                socket.on(eventName, function (item) {
                    cb(item);
                });

            },

            /**
             * Register listeners to sync an array with updates on a model
             *
             * Takes the array we want to sync, the model name that socket updates are sent from,
             * and an optional callback function after new items are updated.
             *
             * @param {String} modelName
             * @param {Array} array
             * @param {Function} cb
             */
            syncUpdates: function (modelName, array, cb) {
                cb = cb || angular.noop;

                /**
                 * Syncs item creation/updates on 'model:save'
                 */
                socket.on(modelName + ':save', function (item) {

                    if (item.modelName) {
                        var resourceService = $injector.get(item.modelName);
                        item = new resourceService(item);
                    }

                    var oldItem = _.find(array, {_id: item._id});
                    var index = array.indexOf(oldItem);
                    var event = 'created';

                    // replace oldItem if it exists
                    // otherwise just add item to the collection
                    if (oldItem) {
                        array.splice(index, 1, item);
                        event = 'updated';
                    } else {
                        array.push(item);
                    }

                    cb(event, item, array);
                });

                /**
                 * Syncs removed items on 'model:remove'
                 */
                socket.on(modelName + ':remove', function (item) {
                    var event = 'deleted';
                    _.remove(array, {_id: item._id});
                    cb(event, item, array);
                });
            },

            syncCreation: function(modelName, array, cb) {
                cb = cb || angular.noop;

                /**
                 * A new item 'model:create'
                 */
                socket.on(modelName + ':create', function (item) {

                    if (item.modelName) {
                        var resourceService = $injector.get(item.modelName);
                        item = new resourceService(item);
                    }

                    var event = 'created';
                    array.push(item);

                    cb(event, item, array);
                });

            },

            /**
             * Removes listeners for a models updates on the socket
             *
             * @param modelName
             */
            unsyncUpdates: function (modelName) {
                socket.removeAllListeners(modelName + ':save');
                socket.removeAllListeners(modelName + ':remove');
            }
        };
    });
