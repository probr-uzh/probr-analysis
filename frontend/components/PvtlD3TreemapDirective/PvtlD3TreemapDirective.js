(function (angular, d3) {
    'use strict';

    angular
        .module('pvtlD3Treemap', [])
        .directive('pvtlD3Treemap', function ($compile) {
            return {
                restrict: 'E',
                scope: {
                    data: '='
                },
                compile: function (compileJqElement, attrs) {
                    var valueAttr = attrs.value,
                        widthAttr = parseInt(attrs.width, 10),
                        heightAttr = parseInt(attrs.height, 10),
                        compileElement = compileJqElement[0],
                        nodeTemplate = compileElement.children[0],
                        nodeTemplateOuterHtml;

                    if (!valueAttr) {
                        throw new Error('You must specify the value property');
                    }

                    if (!widthAttr || !heightAttr) {
                        throw new Error('You must specify both width and height');
                    }

                    if (compileElement.children.length !== 1) {
                        throw new Error('You must specify a node template as a single child of the directive element');
                    }

                    compileElement.removeChild(nodeTemplate);
                    nodeTemplateOuterHtml = nodeTemplate.outerHTML;

                    function postLink(scope, jqElement) {
                        var element = jqElement[0], div, treemap;

                        function setup() {
                            div = d3.select(element)
                                .append("div")
                                .style('position', 'relative');

                            treemap = d3.layout.treemap()
                                .size([widthAttr, heightAttr])
                                .value(function (d) {
                                    return d[valueAttr];
                                });
                        }

                        function clear() {
                            div.selectAll(".pvtlD3TreemapNode").remove();
                        }

                        function createNode(d) {
                            var nodeScope = scope.$new(),
                                linkFn = $compile(angular.element(nodeTemplateOuterHtml));
                            angular.extend(nodeScope, d);
                            return linkFn(nodeScope)[0];
                        }

                        function pixels(property) {
                            return function (d) {
                                return d[property] + "px";
                            };
                        }

                        function positionNode() {
                            this.style({
                                position: 'absolute',
                                left: pixels('x'),
                                top: pixels('y'),
                                width: pixels('dx'),
                                height: pixels('dy')
                            });
                        }

                        function update(data) {
                            var updateSelection = div.datum(data)
                                .selectAll(".pvtlD3TreemapNode")
                                .data(treemap.nodes, function (d) {
                                    function generateUniqueID() {
                                        return Object.keys(d).reduce(function (previousValue, currentValue) {
                                            return previousValue + d[currentValue];
                                        }, 'id:');
                                    }

                                    return generateUniqueID();
                                });

                            updateSelection.enter()
                                .append(createNode)
                                .attr("class", "pvtlD3TreemapNode")
                                .call(positionNode);

                            updateSelection.exit()
                                .remove();
                        }

                        setup();

                        scope.$watch('data', function (newData) {
                            if (newData) {
                                update(newData);
                            } else {
                                clear();
                            }
                        });
                    }

                    return {
                        post: postLink
                    };
                }
            };
        });

}(angular, d3));