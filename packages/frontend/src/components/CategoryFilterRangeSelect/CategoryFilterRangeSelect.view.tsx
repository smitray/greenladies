import React, { useEffect, useState } from 'react';

import { Range } from 'rc-slider';

import { CategoryFilterBase } from '../CategoryFilterBase';
import { CategoryFilterColumns } from '../CategoryFilterColumns';

import { RangeInput, RangeInputSeparator, RangeInputWrapper, RangeWrapper } from './CategoryFilterRangeSelect.styles';

interface SliderHandleProps {
	offset: number;
	dragging: boolean;
}

const KNOB_SIZE = 24;
const GROW_FACTOR = 1.15;

const SliderHandle: React.FC<SliderHandleProps> = ({ offset, dragging }) => {
	return (
		<div
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
	from: number;
	to: number;
	onFromChange?: (from: number) => void;
	onToChange?: (to: number) => void;
}

export const CategoryFilterRangeSelectView: React.FC<Props> = ({
	open,
	onOpenRequest,
	onCloseRequest,
	title,
	min,
	max,
	from,
	to,
	onFromChange,
	onToChange,
}) => {
	const [fromInput, setFromInput] = useState(from.toString());
	const [fromInputFocused, setFromInputFocused] = useState(false);
	const [toInput, setToInput] = useState(to.toString());
	const [toInputFocused, setToInputFocused] = useState(false);

	useEffect(() => {
		if (!fromInputFocused) {
			setFromInput(from.toString());
		}
	}, [from, fromInputFocused]);

	useEffect(() => {
		if (!toInputFocused) {
			setToInput(to.toString());
		}
	}, [to, toInputFocused]);

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
							<RangeInputWrapper>
								<RangeInput
									maxLength={5}
									value={fromInput}
									onChange={event => {
										const input = parseInput(event.target.value);
										const isNum = /^\d+$/.test(input);
										if (onFromChange) {
											if (isNum) {
												const newFrom = parseInt(input, 10);
												onFromChange(Math.max(Math.min(newFrom, to), min));
											} else {
												onFromChange(min);
											}
										}

										setFromInput(input);
									}}
									onFocus={() => setFromInputFocused(true)}
									onBlur={() => setFromInputFocused(false)}
								/>
								<RangeInputSeparator />
								<RangeInput
									maxLength={5}
									value={toInput}
									onChange={event => {
										const input = parseInput(event.target.value);
										const isNum = /^\d+$/.test(input);
										if (onToChange) {
											if (isNum) {
												const newTo = parseInt(input, 10);
												onToChange(Math.min(Math.max(newTo, from), max));
											} else {
												onToChange(max);
											}
										}

										setToInput(input);
									}}
									onFocus={() => setToInputFocused(true)}
									onBlur={() => setToInputFocused(false)}
								/>
							</RangeInputWrapper>
							<RangeWrapper>
								<Range
									min={min}
									max={max}
									value={[from, to]}
									onChange={values => {
										const [newFrom, newTo] = values;
										if (newFrom !== from && onFromChange) {
											onFromChange(newFrom);
										}

										if (newTo !== to && onToChange) {
											onToChange(newTo);
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
