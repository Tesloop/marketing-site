let Colors = require('material-ui/lib/styles/colors');
let ColorManipulator = require('material-ui/lib/utils/color-manipulator');
let Spacing = require('material-ui/lib/styles/spacing');

export default {
	spacing: Spacing,
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: Colors.red500,
		primary2Color: Colors.red700,
		primary3Color: Colors.lightBlack,
		accent1Color: Colors.pinkA200,
		accent2Color: Colors.grey100,
		accent3Color: Colors.grey500,
		textColor: Colors.darkBlack,
		alternateTextColor: Colors.white,
		canvasColor: "#222124",
		borderColor: Colors.grey300,
		disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
	},
};
