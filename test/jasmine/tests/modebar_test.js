var d3 = require('d3');

var createModebar = require('@src/components/modebar');
var manageModebar = require('@src/components/modebar/manage');


describe('Modebar', function() {
    'use strict';

    function getMockContainerTree() {
        var root = document.createElement('div');
        root.className = 'plot-container';
        var parent = document.createElement('div');
        parent.className = 'svg-container';
        root.appendChild(parent);

        return parent;
    }

    function getMockGraphInfo() {
        return {
            _fullLayout: {
                dragmode: 'zoom',
                _paperdiv: d3.select(getMockContainerTree())
            },
            _context: {
                displaylogo: true,
                displayModeBar: true,
                modebarButtonsToRemove: []
            }
        };
    }

    function countGroups(modebar) {
        return d3.select(modebar.element).selectAll('div.modebar-group')[0].length;
    }

    function countButtons(modebar) {
        return d3.select(modebar.element).selectAll('a.modebar-btn')[0].length;
    }

    function countLogo(modebar) {
        return d3.select(modebar.element).selectAll('a.plotlyjsicon')[0].length;
    }


    var buttons = [['toImage', 'sendDataToCloud']];
    var modebar = createModebar(getMockGraphInfo(), buttons);

    describe('createModebar', function() {
        it('creates a modebar', function() {
            expect(countGroups(modebar)).toEqual(2);
            expect(countButtons(modebar)).toEqual(3);
            expect(countLogo(modebar)).toEqual(1);
        });
    });

    describe('modebar.removeAllButtons', function() {
        it('removes all modebar buttons', function() {
            modebar.removeAllButtons();

            expect(modebar.element.innerHTML).toEqual('');
            expect(modebar.hasLogo).toBe(false);
        });
    });

    describe('modebar.destroy', function() {
        it('removes the modebar entirely', function() {
            var modebarParent = modebar.element.parentNode;

            modebar.destroy();

            expect(modebarParent.querySelector('.modebar')).toBeNull();
        });
    });

    describe('manageModebar', function() {

        it('creates modebar (cartesian version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['zoom2d', 'pan2d'],
                ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                ['hoverClosest2d', 'hoverCompare2d']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasCartesian = true;
            gd._fullLayout.xaxis = {fixedrange: false};

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(5);
            expect(countButtons(modebar)).toEqual(11);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('creates modebar (cartesian fixed-axes version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['hoverClosest2d', 'hoverCompare2d']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasCartesian = true;

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(3);
            expect(countButtons(modebar)).toEqual(5);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('creates modebar (gl3d version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['zoom3d', 'pan3d', 'orbitRotation', 'tableRotation'],
                ['resetCameraDefault3d', 'resetCameraLastSave3d'],
                ['hoverClosest3d']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasGL3D = true;

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(5);
            expect(countButtons(modebar)).toEqual(10);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('creates modebar (geo version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['zoomInGeo', 'zoomOutGeo', 'resetGeo'],
                ['hoverClosestGeo']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasGeo = true;

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(4);
            expect(countButtons(modebar)).toEqual(7);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('creates modebar (gl2d version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['zoom2d', 'pan2d'],
                ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                ['hoverClosestGl2d']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasGL2D = true;

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(5);
            expect(countButtons(modebar)).toEqual(10);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('creates modebar (pie version)', function() {
            var buttons = [
                ['toImage', 'sendDataToCloud'],
                ['hoverClosestPie']
            ];

            var gd = getMockGraphInfo();
            gd._fullLayout._hasPie = true;

            manageModebar(gd);
            var modebar = gd._fullLayout._modebar;

            expect(modebar.hasButtons(buttons)).toBe(true);
            expect(countGroups(modebar)).toEqual(3);
            expect(countButtons(modebar)).toEqual(4);
            expect(countLogo(modebar)).toEqual(1);
        });

        it('throws an error if modebarButtonsToRemove isn\'t an array', function() {
            var gd = getMockGraphInfo();
            gd._context.modebarButtonsToRemove = 'not gonna work';

            expect(function() { manageModebar(gd); }).toThrowError();
        });

        it('displays or not modebar according to displayModeBar config arg', function() {
            var gd = getMockGraphInfo();
            manageModebar(gd);
            expect(gd._fullLayout._modebar).toBeDefined();

            gd._context.displayModeBar = false;
            manageModebar(gd);
            expect(gd._fullLayout._modebar).not.toBeDefined();
        });

        it('displays or not logo according to displaylogo config arg', function() {
            var gd = getMockGraphInfo();
            manageModebar(gd);
            expect(countLogo(gd._fullLayout._modebar)).toEqual(1);

            gd._context.displaylogo = false;
            manageModebar(gd);
            expect(countLogo(gd._fullLayout._modebar)).toEqual(0);
        });

        it('updates modebar buttons if plot type changes', function() {
            var gd = getMockGraphInfo();
            gd._fullLayout._hasCartesian = true;
            gd._fullLayout.xaxis = {fixedrange: false};

            manageModebar(gd);  // gives 11 buttons
            gd._fullLayout._hasCartesian = false;
            gd._fullLayout._hasGL3D = true;
            manageModebar(gd);

            expect(countButtons(gd._fullLayout._modebar)).toEqual(10);
        });

        it('updates modebar buttons if plot type changes', function() {
            var gd = getMockGraphInfo();
            gd._fullLayout._hasCartesian = true;
            gd._fullLayout.xaxis = {fixedrange: false};

            manageModebar(gd);  // gives 11 buttons
            gd._context.modebarButtonsToRemove = ['toImage', 'sendDataToCloud'];
            manageModebar(gd);

            expect(countButtons(gd._fullLayout._modebar)).toEqual(9);
        });

    });

});