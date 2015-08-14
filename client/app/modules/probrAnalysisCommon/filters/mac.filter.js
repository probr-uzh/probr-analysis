angular.module('probrAnalysisCommon').filter('mac', function () {
    return function (input) {

        var chunk = function(str, n) {
            var ret = [];
            var len = str.length;

            for (var i = 0; i < len; i += n) {
                ret.push(str.substr(i, n));
            }

            return ret;
        }

        return chunk(input, 2).join(':');
    };
});