import React, { MouseEvent, ReactElement, ReactNode, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'; // Language
import 'prismjs/themes/prism.css'; // Theme

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
	width = '500px',
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
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	const [press, setPress] = React.useState([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	]);

	const [start, setStart] = React.useState('C');
	const [labels, setLabels] = React.useState(false);
	const [half, setHalf] = React.useState(false);
	const [color_black, setColor_black] = React.useState('#AA0044');
	const [color_white, setColor_white] = React.useState('#FF0055');
	const [pickerBlack, setPickerBlack] = React.useState(false);
	const [pickerWhite, setPickerWhite] = React.useState(false);
	const [copyButton, setCopyButton] = React.useState('Copy');

	const code = `<Scale
	labels = ${labels}
	half = ${half}
	start = '${start}'
	pressed = [${press}]
	color_black = '${color_black}' 
	color_white = '${color_white}'
	width = '600px'
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

	function handleChangeLabels() {
		setLabels(!labels);
	}

	function popupPickerBlack() {
		setPickerBlack((prev) => !prev);
	}
	function popupPickerWhite() {
		setPickerWhite((prev) => !prev);
	}

	return (
		<div className="App">
			<div className="Navbar">
				<h1>Scale Maker</h1>
			</div>
			<div className="container">
				<h1>Make Your Scale</h1>
				<Scale
					start={start}
					labels={labels}
					half={half}
					press={press}
					setPress={setPress}
					color_black={color_black}
					color_white={color_white}
					width="800px"
				/>
				<div className="labelSelector">
					<div className="line">
						<p>Labels : </p>
						<label
							className="toggle"
							htmlFor="labels"
						>
							<input
								className="toggle__input"
								name=""
								type="checkbox"
								id="labels"
								onChange={handleChangeLabels}
							></input>
							<div className="toggle__fill"></div>
						</label>
					</div>
					<div className="line">
						<p>Half : </p>
						<label
							className="toggle"
							htmlFor="half"
						>
							<input
								className="toggle__input"
								name=""
								type="checkbox"
								id="half"
								onChange={() => setHalf(!half)}
							></input>
							<div className="toggle__fill"></div>
						</label>
					</div>
					<div className="line">
						<p>Start : </p>
						<Card>C</Card>
						<Card>D</Card>
						<Card>E</Card>
						<Card>F</Card>
						<Card>G</Card>
						<Card>A</Card>
						<Card>B</Card>
					</div>
					<div className="line">
						<p>Color Black : </p>
						{pickerBlack && (
							<Sketch
								style={{
									zIndex: 2,
									marginLeft: 20,
									position: 'absolute',
									translate: '-5% 60%',
								}}
								color={color_black}
								onChange={(color) => {
									setColor_black(color.hex.toLocaleUpperCase());
								}}
							/>
						)}
						<div
							className="card"
							onClick={popupPickerBlack}
						>
							{color_black}
						</div>
					</div>
					<div className="line">
						<p>Color White : </p>
						{pickerWhite && (
							<Sketch
								style={{
									zIndex: 2,
									marginLeft: 20,
									position: 'absolute',
									translate: '-5% 60%',
								}}
								color={color_white}
								onChange={(color) => {
									setColor_white(color.hex.toLocaleUpperCase());
								}}
							/>
						)}
						<div
							className="card"
							onClick={popupPickerWhite}
						>
							{color_white}
						</div>
					</div>
				</div>
				<pre>
					<code className="language-javascript">{code}</code>
					<button
						className="copyButton"
						onClick={(e) => {
							navigator.clipboard.writeText(code);
							setCopyButton('Copied!');
							setTimeout(() => {
								setCopyButton('Copy');
								// console.log(e.target as HTMLInputElement);
							}, 1000);
						}}
					>
						{copyButton}
					</button>
				</pre>
			</div>
		</div>
	);
}

export default App;
