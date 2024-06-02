import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	Card,
	CardContent,
	IconButton,
	Typography,
	InputBase,
} from "@mui/material";
import React, { useState } from "react";

const WhysCard = ({ value, addWhysToList, setFiveWhys }) => {
	const [isSelected, setIsSelected] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(value);

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const handleSave = () => {
		setIsEditing(false);
		setFiveWhys((prev) =>
			prev.map((why, index) => (why === value ? text : why))
		);

		addWhysToList(text);
	};

	return (
		<Card
			sx={{
				borderRadius: 6.2,
				boxShadow: 3,
				maxWidth: "800px",
				width: "95%",
				margin: "auto",
			}}>
			<CardContent sx={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => {
						setIsSelected((prev) => !prev);
						addWhysToList(text);
					}}>
					{isSelected ? <CheckCircleIcon /> : <CheckCircleOutlinedIcon />}
				</IconButton>
				{isEditing ? (
					<InputBase
						value={text}
						onChange={handleTextChange}
						onBlur={handleSave}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSave();
							}
						}}
						autoFocus
						fullWidth
						sx={{ ml: 2 }}
					/>
				) : (
					<Typography
						variant="body1"
						sx={{
							mt: 1,
							color: "#8e8e8e",
							cursor: "pointer",
							ml: 2,
						}}
						onClick={() => {
							if (isSelected) {
								alert("Cannot modify as already been selected.");
								return;
							}
							setIsEditing(true);
						}}>
						{text}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};

export default WhysCard;
