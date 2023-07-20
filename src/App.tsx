import React, { MouseEvent, ReactElement, ReactNode, useEffect } from 'react';
import hljs from 'highlight.js';

import 'highlight.js/styles/tokyo-night-dark.css';

import { Sketch } from '@uiw/react-color';
// styles
import './styles.css';
// import './font.css';
// components
// import Scale from './Scale';

type AppProps = {
	labels?: Boolean;
	half?: Boolean;
	start?: string;
	press: number[];
	setPress: React.Dispatch<React.SetStateAction<number[]>>;
	color_black?: string;
	color_white?: string;
	width: string;
};

const scale: Array<string> = [
	'A',
	'A#',
	'B',
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
];

function Scale({
	labels = false,
	half = true,
	start = 'C',
	press,
	setPress,
	color_white = '#ff0055',
	color_black = '#aa0044',
	width = '80%',
}: AppProps) {
	function handlePressed(event: MouseEvent) {
		if (event.target) {
			let tempArray = [...press];
			tempArray[Number((event.target as HTMLElement).id)] =
				tempArray[Number((event.target as HTMLElement).id)] === 0 ? 1 : 0;
			setPress(tempArray);
		}
	}

	function calcadd(num: number, i: number): number {
		return num + 90 * i;
	}
	function calcaddb(num: number, i: number): number {
		return num - 25 + 90 * (i + 1);
	}

	function fillWhite(): ReactNode {
		let imagenode: ReactNode;
		let elements: Array<ReactElement> = [];
		let startIndex = scale.indexOf(start);
		let labelCounter = 1;

		// Split pressed
		let whitePressed: Array<Array<number | string | boolean>> = [];
		let temp = startIndex;
		press.forEach((item, index) => {
			if (!scale[temp % 12].includes('#')) {
				whitePressed.push([item, scale[temp % 12], index]);
			}
			temp++;
		});
		temp = startIndex;
		// Conditional loop
		for (let i: number = 0; i < (half ? 7 : 10); i++) {
			// Label logic

			i !== 0 && whitePressed[i][1] === 'C' && labelCounter++;
			elements.push(
				<>
					<rect
						x={calcadd(2, i)}
						y="2"
						width="90"
						height="300"
						fill={!whitePressed[i][0] ? '#FCFCFC' : color_white}
						stroke="#1E1E1E"
						strokeWidth="3"
						id={whitePressed[i][2].toString()}
						onClick={(event) => {
							handlePressed(event);
						}}
					/>
					<path
						d={`M${calcadd(2 + 2, i)} 292H${calcadd(92 - 2, i)}V300.5H${calcadd(
							2 + 2,
							i
						)}V292Z`}
						fill={!whitePressed[i][0] ? '#EFEFEF' : color_white}
					/>

					{labels && (
						<text
							x={calcadd(25, i)}
							y={280}
							className="textStyles"
							fill="#1f1f22"
							id={whitePressed[i][2].toString()}
							onClick={(e) => handlePressed(e)}
						>
							{`${whitePressed[i][1]}${labelCounter}`}
						</text>
					)}
				</>
			);
		}

		imagenode = elements;
		return imagenode;
	}

	function fillBlack(): ReactNode {
		let imagenode: ReactNode;
		let elements: Array<ReactElement> = [];
		let keys: Array<null | string> = [];
		let startIndex = scale.indexOf(start);

		// Split pressed
		let blackPressed: Array<Array<number | string | boolean>> = [];
		let temp = startIndex;
		press.forEach((item, index) => {
			if (scale[temp % 12].includes('#')) {
				blackPressed.push([item, index]);
			}
			temp++;
		});

		// Scale genereation logic
		for (let i: number = 0; i < 17; i++, startIndex++) {
			if (scale[startIndex % 12].includes('#')) {
				keys.push(scale[startIndex % 12]);
			} else if (
				scale[startIndex % 12] === 'E' ||
				scale[startIndex % 12] === 'B'
			) {
				keys.push(null);
			}
		}
		console.log(keys);

		// Loop logic
		for (let i: number = 0, j: number = 0; i < (half ? 7 : 10); i++) {
			if (!keys[i]) {
				continue;
			}

			elements.push(
				<>
					<rect
						x={calcaddb(2, i)}
						y="2"
						width="50"
						height="175"
						fill={!blackPressed[j][0] ? '#333333' : color_black}
						stroke="#1E1E1E"
						strokeWidth="3"
						id={blackPressed[j][1].toString()}
						onClick={(event) => handlePressed(event)}
					/>
					<path
						d={`M${calcaddb(2 + 1.8, i)} 167H${calcaddb(
							52 - 1.8,
							i
						)}V175.5H${calcaddb(2 + 1.8, i)}V167 Z`}
						fill={!blackPressed[j][0] ? '#4E4E4E' : color_black}
					/>
				</>
			);
			j++;
		}

		imagenode = elements;
		return imagenode;
	}

	return (
		<>
			<style>
				@import url('https://fonts.cdnfonts.com/css/aldo-the-apache');
			</style>
			<div
				style={{
					aspectRatio: half ? 634 / 304 : 904 / 304,
					width: width,
					textAlign: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontWeight: '400',
					fontSize: '50px',
					lineHeight: '50px',
					fontFamily: "'Aldo the Apache', sans-serif",
				}}
			>
				<svg
					style={{
						textAlign: 'center',
						position: 'relative',
						height: '100%',
						width: '100%',
						userSelect: 'none',
					}}
					id="scale"
					width={half ? 634 : 904}
					height="304"
					viewBox={`0 0 ${half ? 634 : 904} 304`}
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{fillWhite()}
					{fillBlack()}
				</svg>
			</div>
		</>
	);
}

type Props = {
	id?: string;
	children: React.ReactNode;
};

function App() {
	const [press, setPress] = React.useState([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);

	const [start, setStart] = React.useState('C');
	const [labels, setLabels] = React.useState(false);
	const [half, setHalf] = React.useState(true);
	const [color_black, setColor_black] = React.useState('#AA0044');
	const [color_white, setColor_white] = React.useState('#FF0055');
	const [pickerBlack, setPickerBlack] = React.useState(false);
	const [pickerWhite, setPickerWhite] = React.useState(false);

	useEffect(() => {
		hljs.highlightAll();
	}, [start, labels, half, color_black, color_white, press]);

	const code = `<Scale
    labels = { ${labels} }
    half = { ${half} }
    start = '${start}'
    pressed = { [${press}] }
    color_black = '${color_black}' 
    color_white = '${color_white}'
    width = '80%'
/>
`;
	const Card: React.FC<Props> = (props) => {
		return (
			<div
				className={start === String(props.children) ? 'card active' : 'card'}
				onClick={() => setStart(String(props.children))}
			>
				{props.children}
			</div>
		);
	};

	function handleChangeHalf() {
		setHalf(!half);
	}

	function handleChangeLabels() {
		setLabels(!labels);
	}

	function popupPickerBlack() {
		setPickerBlack((prev) => !prev);
	}
	function popupPickerWhite() {
		setPickerWhite((prev) => !prev);
	}

	function popupPickerWhiteClose() {
		setPickerWhite(false);
	}

	function popupPickerBlackClose() {
		setPickerBlack(false);
	}

	return (
		<div className="App">
			<div className="navbar">
				<div className="nav-content">
					<div className="header-logo gradient">
						<h1 className="">Scale Maker</h1>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="scale">
					<Scale
						start={start}
						labels={labels}
						half={half}
						press={press}
						setPress={setPress}
						color_black={color_black}
						color_white={color_white}
						width={'100%'}
					/>
				</div>
				<div className="control-panel">
					<div className="check">
						<label className="checkbox-container">
							Labels
							<input
								type="checkbox"
								onChange={handleChangeLabels}
							/>
							<span className="checkmark"></span>
						</label>
					</div>
					<div
						className="check"
						onClick={() => {}}
					>
						<label className="checkbox-container">
							Extended Scale
							<input
								aria-hidden="false"
								className="sr-only"
								type="checkbox"
								onChange={handleChangeHalf}
							/>
							<span className="checkmark"></span>
						</label>
					</div>
					<div className="key-array">
						<Card>C</Card>
						<Card>D</Card>
						<Card>E</Card>
						<Card>F</Card>
						<Card>G</Card>
						<Card>A</Card>
						<Card>B</Card>
					</div>
					<div
						className={pickerWhite ? "picker active" : "picker"}
						onClick={popupPickerWhite}
					>
						White key <span>{color_white}</span>
					</div>
					{pickerWhite ? (
						<div
							className="modal"
							style={{
								position: 'relative',
								// top: '5%',
								zIndex: '2',
							}}
						>
							<div
								style={{
									position: 'fixed',
									top: '0px',
									right: '0px',
									bottom: '20px',
									left: '0px',
								}}
								onClick={popupPickerWhiteClose}
							/>
							<Sketch
								color={color_white}
								onChange={(color) => {
									setColor_white(color.hex.toString().toLocaleUpperCase());
								}}
							/>
						</div>
					) : null}
					<div
						className={pickerBlack ? 'picker active' : 'picker'}
						onClick={popupPickerBlack}
					>
						Black Key <span>{color_black}</span>
					</div>
					{pickerBlack ? (
						<div
							className="modal right"
							style={{
								position: 'relative',
								zIndex: '2',
							}}
						>
							<div
								style={{
									position: 'fixed',
									top: '0px',
									right: '0px',
									bottom: '20px',
									left: '0px',
								}}
								onClick={popupPickerBlackClose}
							/>
							<Sketch
								color={color_black}
								onChange={(color) => {
									setColor_black(color.hex.toString().toLocaleUpperCase());
								}}
							/>
						</div>
					) : null}
				</div>
				<div className="result">
					<div className="code-block">
						<pre>
							<code className="language-javascript">{code}</code>
							<button
								id="button"
								className="copyButton"
								onClick={(e) => {
									navigator.clipboard.writeText(code);
									let btn = document.getElementById(
										(e.target as HTMLButtonElement).id
									);
									if (btn) btn.innerHTML = 'Copied!';
									setTimeout(() => {
										if (btn) btn.innerHTML = 'Copy';
										// console.log(e.target as HTMLInputElement);
									}, 1000);
								}}
							>
								Copy
							</button>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
