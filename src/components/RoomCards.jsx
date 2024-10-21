import { Card, CardMedia, CardContent, Typography, IconButton, Box, Tooltip, Snackbar, Alert } from "@mui/material";
import { Delete, ContentCopy, GroupAdd, MoreHoriz, People } from "@mui/icons-material";
import SampleImage from "../res/sampleImage.jpg";
import axios from "axios";
import { useState } from "react";
import DeleteDialog from "./popupcards/deletedialogpopup/DeleteDialog";
import ChannelListPopup from "./popupcards/channelListPopUp/ChannelListPopup.jsx";
import AddMemberPopup from "./popupcards/addmemberpopup/RoomMembersPopup";

const RoomCards = ({ title, roomCode, ownerId, roomId, onDelete, user }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openChannelList, setOpenChannelList] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [channelList, setChannelList] = useState([]);
    const [openAddMemberPopup, setOpenAddMemberPopup] = useState(false);
    
    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            let token = localStorage.getItem("token");

            await axios.delete(`http://localhost:8000/api/rooms/${roomId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            onDelete(roomId);
            setOpenDeleteDialog(false);
            // Show success snackbar
            setSnackbarMessage("Room deleted successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting room:", error);
            // Show error snackbar
            setSnackbarMessage("Error deleting room.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopyRoomCode = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(roomCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            // Show success snackbar for copying room code
            setSnackbarMessage("Room code copied to clipboard!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to copy room code:", error);
            // Show error snackbar
            setSnackbarMessage("Failed to copy room code.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleShowChannelList = () => {
        setChannelList([{ id: 1, title: "Channel 1" }, { id: 2, title: "Channel 2" }]); // Example channel list with IDs
        setOpenChannelList(true);
    };

    // Close the Snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Card
            sx={{
                maxWidth: 300,
                borderRadius: "16px",
                boxShadow: 3,
                overflow: "hidden",
                position: "relative",
            }}
        >
            <CardMedia
                component="img"
                height="160"
                image={SampleImage}
                alt={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Owner: {ownerId}
                </Typography>
            </CardContent>
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Tooltip title="Options">
                    <IconButton
                        onClick={() => setShowOptions(!showOptions)}
                        sx={{ color: "white" }}
                    >
                        <MoreHoriz />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: 50,
                    right: showOptions ? 50 : 8,
                    display: "flex",
                    gap: 1,
                    transition: "right 0.3s ease",
                    justifyContent: "center",
                    left: 0,
                    right: 0,
                }}
            >
                {showOptions && (
                    <>
                        <Tooltip title="Show Channel List">
                            <IconButton
                                onClick={handleShowChannelList}
                                sx={{ color: "white" }}
                            >
                                <People />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Room Code">
                            <IconButton
                                onClick={handleCopyRoomCode}
                                sx={{ color: "white" }}
                            >
                                <ContentCopy />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Members">
                            <IconButton
                                onClick={() => setOpenAddMemberPopup(true)}
                                sx={{ color: "white" }}
                            >
                                <GroupAdd />
                            </IconButton>
                        </Tooltip>
                        {user.user_type !== "STUDENT" && (
                            <Tooltip title="Delete Room">
                                <IconButton
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{ color: "white" }}
                                    disabled={isDeleting}
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                )}
            </Box>
            {isCopied && (
                <Typography
                    sx={{
                        position: "absolute",
                        bottom: 8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                    }}
                >
                    Room code copied!
                </Typography>
            )}
            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={handleDelete}
                title={title}
                isDeleting={isDeleting}
            />
            <ChannelListPopup
                open={openChannelList}
                onClose={() => setOpenChannelList(false)}
                roomId={roomId} 
                onAddChannel={() => console.log("Add new channel logic goes here.")}
                user={user}
            />

            <AddMemberPopup
                open={openAddMemberPopup}
                onClose={() => setOpenAddMemberPopup(false)}
                roomId={roomId} 
                user={user}
            />

            {/* Snackbar component */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default RoomCards;
