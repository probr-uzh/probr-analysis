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

          var svg = d3.select(element[0]).append("svg")
            .attr('viewBox', '0 0 1000 1000')
            .attr('preserveAspectRatio', 'xMidYMid')
            .attr('shape-rendering', 'crispEdges')
            .style('width', '100%');

          // Sessions are undefined at first run
          if (sessions == undefined) {
            return;
          }

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
            , spaceBetweenGraphs = 60
            , textColumnWidth = 100;

          var margin = {top: 100, right: 15, bottom: 50, left: 15}
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

          // Debug rects
          /*
           svg.append("rect")
           .attr("x", 0)
           .attr("y", 0)
           .attr("width", margin.left)
           .attr("height", height + margin.top + margin.bottom)
           .attr("fill", "red");
           svg.append("rect")
           .attr("x", 0)
           .attr("y", 0)
           .attr("width", width + margin.left + margin.top)
           .attr("height", margin.top)
           .attr("fill", "red");
           svg.append("rect")
           .attr("x", margin.left + width)
           .attr("y", 0)
           .attr("width", margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .attr("fill", "red");
           svg.append("rect")
           .attr("x", 0)
           .attr("y", margin.top + height)
           .attr("width", width + margin.left + margin.top)
           .attr("height", margin.bottom)
           .attr("fill", "red");
           main.append("rect")
           .attr("x", 0)
           .attr("y", 0)
           .attr("width", graphWidth)
           .attr("height", mainHeight)
           .attr("fill", "yellow");
           mini.append("rect")
           .attr("x", 0)
           .attr("y", 0)
           .attr("width", graphWidth)
           .attr("height", miniHeight)
           .attr("fill", "green");
           */

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

          // Axis for mini graph
          var xMiniAxisTop = d3.svg.axis()
            .scale(miniX)
            .orient('top')
            .ticks(d3.time.weeks, 1)
            .tickFormat(d3.time.format('%b  W%W'))
            .tickSize(12, 0, 0);
          mini.append('g')
            .attr('class', 'mini axis weeks')
            .call(xMiniAxisTop)
            .selectAll('text')
            .attr('y', -6) // half of ticksize
            .attr('dy', 0)
            .attr('x', 5)
            .attr('dominant-baseline', 'middle')
            .style('text-anchor', 'start');
          var xMiniAxisBottomDays = d3.svg.axis()
            .scale(miniX)
            .orient('bottom')
            .ticks(d3.time.days, 1)
            .tickFormat(d3.time.format('%d'))
            .tickSize(12, 0, 0);
          mini.append('g')
            .attr('class', 'mini axis days')
            .attr('transform', 'translate(0,' + miniHeight + ')')
            .call(xMiniAxisBottomDays)
            .selectAll('text')
            .attr('y', 6) // half of ticksize
            .attr('dy', 0)
            .attr('x', function(d) {
              var now = new Date();
              return miniX(now) - miniX(d3.time.hour.offset(now, -12));
            })
            .attr('dominant-baseline', 'middle');
          var xMiniAxisBottomMonths = d3.svg.axis()
            .scale(miniX)
            .orient('bottom')
            .ticks(d3.time.months, 1)
            .tickFormat(d3.time.format('%b'))
            .tickSize(25, 0, 0);
          mini.append('g')
            .attr('class', 'mini axis months')
            .attr('transform', 'translate(0,' + miniHeight + ')')
            .call(xMiniAxisBottomMonths)
            .selectAll('text')
            .attr('x', 5)
            .attr('y', 25) // ticksize
            .attr('dy', 0)
            .attr('dominant-baseline', 'alphabetic')
            .style('text-anchor', 'start');

          // Axis for main graph
          var xMainAxisTop = d3.svg.axis()
            .scale(mainX)
            .orient('top')
            .ticks(d3.time.days, 1)
            .tickFormat(d3.time.format('%a %d'))
            .tickSize(6, 0, 0);
          main.append('g')
            .attr('class', 'main axis days')
            .call(xMainAxisTop);
          var xMainAxisBottom = d3.svg.axis()
            .scale(mainX)
            .orient('bottom')
            .ticks(d3.time.hours, 3)
            .tickFormat(d3.time.format('%H:%M'))
            .tickSize(6, 0, 0);
          main.append('g')
            .attr('class', 'main axis hours')
            .attr('transform', 'translate(0,' + mainHeight + ')')
            .call(xMainAxisBottom);

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
            .attr('clip-path', 'url(#clip)');

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

            if ((maxExtent - minExtent) >= 259200000) { // > 3 days
              xMainAxisTop.ticks(d3.days, 1);
              xMainAxisBottom.ticks(d3.time.hours, 6);
            }
            else if ((maxExtent - minExtent) >= 86400000) { // > 1 day
              xMainAxisTop.ticks(d3.days, 1);
              xMainAxisBottom.ticks(d3.time.hours, 3);
            }
            else if ((maxExtent - minExtent) > 28800000) { // > 8 hours
              xMainAxisTop.ticks(d3.days, 1);
              xMainAxisBottom.ticks(d3.time.hours, 1);
            }
            else if ((maxExtent - minExtent) > 10800000) { // > 3 hours
              xMainAxisTop.ticks(d3.days, 1);
              xMainAxisBottom.ticks(d3.time.minutes, 30);
            }
            else {
              xMainAxisTop.ticks(d3.days, 1);
              xMainAxisBottom.ticks(d3.time.minutes, 10);
            }


            // Update scale
            mainX.domain([minExtent, maxExtent]);

            // Update axis
            main.select('.main.axis.days').call(xMainAxisTop);
            main.select('.main.axis.hours').call(xMainAxisBottom);

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
              .attr('class', 'mainItem');

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
