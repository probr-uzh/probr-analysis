/**
 * Created by sebastian on 11/22/15.
 */

'use strict';

angular.module('probrAnalysisApp')
    .directive('probrSessionSwimlane', function () {
        return {
            restrict: 'E',
            scope: {
                sessions: '='
            },
            templateUrl: 'components/probr/probrSessionSwimlane/probrSessionSwimlane.html',
            link: function (scope, element, attrs) {


                scope.$watch('sessions', function (newVal, oldVal) {
                    var sessions = newVal;

                    d3.selectAll("svg").remove();

                    // Don't do anything if sessions are undefined at first run
                    // or there are no sessions
                    if (sessions === undefined || sessions.length === 0) {
                        return;
                    }

                    var svg = d3.select(element[0]).append("svg")
                        .attr('viewBox', '0 0 1000 1000')
                        .attr('preserveAspectRatio', 'xMidYMid')
                        .attr('shape-rendering', 'crispEdges')
                        .style('width', '100%');

                    // Create 'real' date objects
                    sessions.forEach(function(s) {
                        s.startTimestamp = new Date(s.startTimestamp);
                        s.endTimestamp = new Date(s.endTimestamp);
                    });

                    // Get array of unique devices
                    var devices = d3.set(sessions.map(function(s) {
                        return s.mac_address;
                    })).values();

                    // Margin and sizes
                    // Not pixel based, since use uf ViewBox
                    // 1000 corresponds to full width of SVG
                    var mainLaneHeight = 40
                        , miniLaneHeight = 15
                        , spaceBetweenGraphs = 100
                        , textColumnWidth = 60;

                    var margin = {top: 30, right: 15, bottom: 30, left: 15}
                        , width = 1000 - margin.left - margin.right
                        , graphWidth = width - textColumnWidth
                        , mainHeight = devices.length * mainLaneHeight
                        , miniHeight = devices.length * miniLaneHeight
                        , height = miniHeight + mainHeight + spaceBetweenGraphs;

                    // Expand the SVG to fit new data (variable height)
                    svg.attr('viewBox',
                        '0 0 1000 ' + (height + margin.top + margin.bottom) );

                    // Clip path (cut off overlapping rects in mainGraph)
                    svg.append('defs').append('clipPath')
                        .attr('id', 'clip')
                        .append('rect')
                        .attr('width', graphWidth)
                        .attr('height', mainHeight);

                    // Scales
                    var miniX = d3.time.scale()
                        .domain([d3.time.sunday(
                            d3.min(sessions, function(d){return d.startTimestamp})),
                            d3.max(sessions, function(d){return d.endTimestamp})
                        ])
                        .range([0, graphWidth]);
                    var miniY = d3.scale.ordinal()
                        .domain(devices)
                        .rangeBands([0, miniHeight], 0, 0);
                    var miniYPadded = d3.scale.ordinal()
                        .domain(devices)
                        .rangeBands([0, miniHeight], 0.4, 0.2);

                    var mainX = d3.time.scale().range([0, graphWidth]);
                    var mainY = d3.scale.ordinal()
                        .domain(devices)
                        .rangeBands([0, mainHeight]);
                    var mainYPadded = d3.scale.ordinal()
                        .domain(devices)
                        .rangeBands([0, mainHeight], 0.4, 0.2);

                    // Group for margin
                    var plot = svg.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    // Main Graph
                    var main = plot.append('g')
                        .attr('transform', 'translate(' + textColumnWidth + ',0)')
                        .attr('class', 'main');

                    // Mini Graph
                    var mini = plot.append('g')
                        .attr('transform', 'translate('
                        + textColumnWidth + ','
                        + (mainHeight + spaceBetweenGraphs) + ')')
                        .attr('class', 'mini');

                    // Draw mac addresses for main graph
                    main.append('g').selectAll('.laneText')
                        .data(devices)
                        .enter().append('text')
                        .text(function(d) { return d; })
                        .attr('x', -10)
                        .attr('y', function(d) { return mainY(d) + mainY.rangeBand()/2 })
                        .attr('text-anchor', 'end')
                        .attr('dominant-baseline', 'middle')
                        .attr('class', 'laneText');

                    // Draw the lanes for the main graph
                    main.append('g').selectAll('.laneLines')
                        .data(devices)
                        .enter().append('line')
                        .attr('x1', 0)
                        .attr('y1', function(d) { return mainY(d); })
                        .attr('x2', graphWidth)
                        .attr('y2', function(d) { return mainY(d); })
                        .attr('stroke', 'lightgray')
                        .attr('class', 'laneLines');

                    // Draw mac addresses for mini graph
                    mini.append('g').selectAll('.laneText')
                        .data(devices)
                        .enter().append('text')
                        .text(function(d) { return d; })
                        .attr('x', -10)
                        .attr('y', function(d) { return miniY(d) + miniY.rangeBand()/2; })
                        .attr('text-anchor', 'end')
                        .attr('dominant-baseline', 'middle')
                        .attr('class', 'laneText');

                    // Draw the lanes for the mini graph
                    mini.append('g').selectAll('.laneLines')
                        .data(devices)
                        .enter().append('line')
                        .attr('x1', 0)
                        .attr('y1', function(d) { return miniY(d); })
                        .attr('x2', graphWidth)
                        .attr('y2', function(d) { return miniY(d); })
                        .attr('stroke', 'lightgray')
                        .attr('class', 'laneLines');

                    var axisTickFormatTop = d3.time.format.multi([
                        [".%L", function(d) { return d.getMilliseconds(); }],
                        [":%S", function(d) { return d.getSeconds(); }],
                        ["%H:%M", function(d) { return d.getMinutes(); }],
                        ["%H:00", function(d) { return d.getHours(); }],
                        ["%d.%m", function(d) { return d.getDate() != 1; }],
                        ["%B", function(d) { return d.getMonth(); }],
                        ["%Y", function() { return true; }]
                    ]);

                    var axisTickFormatBottom = d3.time.format.multi([
                        [".%L", function(d) { return d.getMilliseconds(); }],
                        [":%S", function(d) { return d.getSeconds(); }],
                        ["%H:%M", function(d) { return d.getMinutes(); }],
                        ["%H:00", function(d) { return d.getHours(); }],
                        ["%a", function(d) { return d.getDate() != 1; }],
                        ["%B", function(d) { return d.getMonth(); }],
                        ["%Y", function() { return true; }]
                    ]);

                    // Axis for mini graph
                    var xMiniAxisTop = d3.svg.axis()
                        .scale(miniX)
                        .orient('top')
                        .tickFormat(axisTickFormatTop)
                        .tickSize(12, 0);
                    mini.append('g')
                        .attr('class', 'mini axis top')
                        .call(xMiniAxisTop);

                    var xMiniAxisBottom = d3.svg.axis()
                        .scale(miniX)
                        .orient('bottom')
                        .tickFormat(axisTickFormatBottom)
                        .tickSize(12, 0);
                    mini.append('g')
                        .attr('class', 'mini axis bottom')
                        .attr('transform', 'translate(0,' + miniHeight + ')')
                        .call(xMiniAxisBottom)

                    // Axis for main graph
                    var xMainAxisTop = d3.svg.axis()
                        .scale(mainX)
                        .orient('top')
                        .tickFormat(axisTickFormatTop)
                        .tickSize(12, 1);
                    main.append('g')
                        .attr('class', 'main axis top')
                        .call(xMainAxisTop);

                    var xMainAxisBottom = d3.svg.axis()
                        .scale(mainX)
                        .orient('bottom')
                        .tickFormat(axisTickFormatBottom)
                        .ticks(20)
                        .tickSize(12, 0);
                    main.append('g')
                        .attr('class', 'main axis bottom')
                        .attr('transform', 'translate(0,' + mainHeight + ')')
                        .call(xMainAxisBottom);

                    // Tooltips
                    var timeFormat = d3.time.format('%x %X');
                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            var tags = d.tags;
                            return  "<p>From:</p> <p class='right'>" + timeFormat(d.startTimestamp)  + "</p>" +
                                    "<p>Until:</p> <p class='right'>" + timeFormat(d.endTimestamp) + "</p>" +
                                    "<p>Duration:</p> <p class='right'>" + d.duration + " seconds</p>" +
                                    "<p>Packets:</p> <p class='right'>" + d.count + "</p>" +
                                    "<p>Avg RSS:</p> <p class='right'>" + d.weightedSignalStrength + "db</p>" +
                                    "<p>Tags:</p> <p class='right'>" + d.tags.join(', ') + "</p>";
                        });
                    plot.call(tip);

                    // Draw rectangles for mini graph
                    mini.append('g').selectAll('miniItems')
                        .data(sessions)
                        .enter().append('rect')
                        .attr('class', 'miniItem')
                        .attr('x', function(d) { return miniX(d.startTimestamp); })
                        .attr('y', function(d) { return miniYPadded(d.mac_address); })
                        .attr('width', function(d) { return miniX(d.endTimestamp)-miniX(d.startTimestamp); })
                        .attr('height', function(d) { return miniYPadded.rangeBand(); });

                    // Space for later main rectangles
                    // Clipping for rects that overlap graph plot area
                    var itemRects = main.append('g')
                        .attr('clip-path', 'url(' + location.href + '#clip)');

                    // Selection area (invisible)
                    mini.append('rect')
                        .attr('pointer-events', 'painted')
                        .attr('width', graphWidth)
                        .attr('height', miniHeight)
                        .attr('visibility', 'hidden')
                        .on('mouseup', moveBrush);

                    // Draw selection area
                    var brush = d3.svg.brush()
                        .x(miniX)
                        .extent([d3.time.monday(new Date()),d3.time.saturday.ceil(new Date())])
                        .on("brush", display);

                    mini.append('g')
                        .attr('class', 'brush')
                        .call(brush)
                        .selectAll('rect')
                        .attr('y', 1)
                        .attr('height', miniHeight - 1);


                    display();

                    function display () {
                        var minExtent = d3.time.hour(brush.extent()[0])
                            , maxExtent = d3.time.hour(brush.extent()[1]);
                        var visibleSessions = sessions.filter(function (d) {
                            return (d.startTimestamp > minExtent && d.startTimestamp < maxExtent)
                                ||     (d.endTimestamp > minExtent && d.endTimestamp < maxExtent)
                                ||     (d.startTimestamp < minExtent && d.endTimestamp > maxExtent);
                        });

                        // Snap to hours
                        mini.select('.brush').call(brush.extent([minExtent, maxExtent]));

                        // Update scale
                        mainX.domain([minExtent, maxExtent]);

                        // Update axis
                        main.select('.main.axis.top').call(xMainAxisTop);
                        main.select('.main.axis.bottom').call(xMainAxisBottom);

                        // upate the item rects
                        var rects = itemRects.selectAll('rect')
                            .data(visibleSessions, function (d) { return d._id; })
                            .attr('x', function(d) { return mainX(d.startTimestamp); })
                            .attr('width', function(d) { return mainX(d.endTimestamp) - mainX(d.startTimestamp); });

                        rects.enter().append('rect')
                            .attr('x', function(d) { return mainX(d.startTimestamp); })
                            .attr('y', function(d) { return mainYPadded(d.mac_address); })
                            .attr('width', function(d) { return mainX(d.endTimestamp) - mainX(d.startTimestamp); })
                            .attr('height', function(d) { return mainYPadded.rangeBand(); })
                            .attr('class', 'mainItem')
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide);

                        rects.exit().remove();

                    }

                    function moveBrush () {
                        var origin = d3.mouse(this)
                            , point = mainX.invert(origin[0])
                            , halfExtent = (brush.extent()[1].getTime() - brush.extent()[0].getTime()) / 2
                            , start = new Date(point.getTime() - halfExtent)
                            , end = new Date(point.getTime() + halfExtent);
                        brush.extent([start,end]);
                        display();
                    }

                });
            }
        };
    });
