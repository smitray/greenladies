import React, { useEffect, useState } from 'react';

import { Range } from 'rc-slider';

import { CategoryFilterBase } from '../CategoryFilterBase';
import { CategoryFilterColumns } from '../CategoryFilterColumns';

import {
	RangeInput,
	RangeInputContainer,
	RangeInputPostfix,
	RangeInputSeparator,
	RangeInputWrapper,
	RangeWrapper,
} from './CategoryFilterRangeSelect.styles';

interface SliderHandleProps {
	index: number;
	offset: number;
	dragging: boolean;
}

const KNOB_SIZE = 24;
const GROW_FACTOR = 1.15;

const SliderHandle: React.FC<SliderHandleProps> = ({ index, dragging, offset }) => {
	return (
		<div
			key={index}
			style={{
				width: `${dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE}px`,
				height: `${dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE}px`,
				background: 'black',
				borderRadius: '100%',
				position: 'absolute',
				transform: 'translateX(-50%)',
				marginTop: `-${((dragging ? KNOB_SIZE * GROW_FACTOR : KNOB_SIZE) - 2) / 2}px`,
				left: `${offset}%`,
				transition: 'all 50ms ease -in -out',
				cursor: 'pointer',
			}}
		/>
	);
};

function parseInput(input: string) {
	if (input.length === 0) {
		return input;
	}

	if (input.length > 1 && input[0] === '0') {
		return input.substring(1);
	}

	return input;
}

interface Props {
	open: boolean;
	onOpenRequest?: () => void;
	onCloseRequest?: () => void;
	title: string;
	min: number;
	max: number;
	lowerValue: number;
	upperValue: number;
	onLowerValueChange?: (lowerValue: number) => void;
	onUpperValueChange?: (upperValue: number) => void;
}

export const CategoryFilterRangeSelectView: React.FC<Props> = ({
	open,
	onOpenRequest,
	onCloseRequest,
	title,
	min,
	max,
	lowerValue,
	upperValue,
	onLowerValueChange,
	onUpperValueChange,
}) => {
	const [lowerValueInput, setLowerValueInput] = useState(lowerValue.toString());
	const [lowerValueInputFocused, setLowerValueInputFocused] = useState(false);
	const [upperValueInput, setUpperValueInput] = useState(upperValue.toString());
	const [upperValueInputFocused, setUpperValueInputFocused] = useState(false);
	const [lowerValueInternal, setLowerValueInternal] = useState(lowerValue);
	const [upperValueInternal, setUpperValueInternal] = useState(upperValue);

	useEffect(() => {
		setLowerValueInternal(lowerValue);
	}, [lowerValue]);

	useEffect(() => {
		setUpperValueInternal(upperValue);
	}, [upperValue]);

	// Update from input field when changing slider
	useEffect(() => {
		if (!lowerValueInputFocused) {
			setLowerValueInput(lowerValueInternal.toString());
		}
	}, [lowerValueInternal, lowerValueInputFocused]);

	// Update to input field when changing slider
	useEffect(() => {
		if (!upperValueInputFocused) {
			setUpperValueInput(upperValueInternal.toString());
		}
	}, [upperValueInternal, upperValueInputFocused]);

	return (
		<CategoryFilterBase
			open={open}
			onOpenRequest={onOpenRequest}
			onCloseRequest={onCloseRequest}
			title={title}
			content={
				<CategoryFilterColumns
					onCloseRequest={onCloseRequest}
					columns={[
						<li key="0">
							<RangeInputContainer>
								<RangeInputWrapper>
									<RangeInput
										maxLength={5}
										value={lowerValueInput}
										onChange={event => {
											const parsedInput = parseInput(event.target.value);
											const isNum = /^\d+$/.test(parsedInput);
											if (isNum) {
												const newLowerValue = Math.max(Math.min(parseInt(parsedInput, 10), upperValue), min);
												setLowerValueInternal(newLowerValue);
											} else {
												setLowerValueInternal(min);
											}

											setLowerValueInput(parsedInput);
										}}
										onFocus={() => setLowerValueInputFocused(true)}
										onBlur={() => {
											setLowerValueInputFocused(false);
											if (onLowerValueChange && lowerValueInternal !== lowerValue) {
												onLowerValueChange(lowerValueInternal);
											}
										}}
									/>
									<RangeInputPostfix>kr</RangeInputPostfix>
								</RangeInputWrapper>
								<RangeInputSeparator />
								<RangeInputWrapper>
									<RangeInput
										maxLength={5}
										value={upperValueInput}
										onChange={event => {
											const parsedInput = parseInput(event.target.value);
											const isNum = /^\d+$/.test(parsedInput);
											if (isNum) {
												const newUpperValue = Math.min(Math.max(parseInt(parsedInput, 10), lowerValue), max);
												setUpperValueInternal(newUpperValue);
											} else {
												setUpperValueInternal(min);
											}

											setUpperValueInput(parsedInput);
										}}
										onFocus={() => setUpperValueInputFocused(true)}
										onBlur={() => {
											setUpperValueInputFocused(false);
											if (onUpperValueChange && upperValueInternal !== upperValue) {
												onUpperValueChange(upperValueInternal);
											}
										}}
									/>
									<RangeInputPostfix>kr</RangeInputPostfix>
								</RangeInputWrapper>
							</RangeInputContainer>
							<RangeWrapper>
								<Range
									min={min}
									max={max}
									value={[lowerValueInternal, upperValueInternal]}
									onChange={values => {
										const [newLowerValue, newUpperValue] = values;
										setLowerValueInternal(newLowerValue);
										setUpperValueInternal(newUpperValue);
									}}
									onAfterChange={values => {
										const [newLowerValue, newUpperValue] = values;
										if (onLowerValueChange && newLowerValue !== lowerValue) {
											onLowerValueChange(newLowerValue);
										}

										if (onUpperValueChange && newUpperValue !== upperValue) {
											onUpperValueChange(newUpperValue);
										}
									}}
									pushable
									railStyle={{ background: '#eaeaea' }}
									trackStyle={[{ background: 'black' }]}
									handle={SliderHandle}
								/>
							</RangeWrapper>
						</li>,
					]}
				/>
			}
		/>
	);
};
