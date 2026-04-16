import React from "react";
import { Box, Button, Fade, Modal, Stack, Typography } from "@mui/material";

interface PhotoModalProps {
  open: boolean;
  photoUrl: string | null;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ open, photoUrl, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="photo-modal-title"
      aria-describedby="photo-modal-description"
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
    >
      <Fade in={open}>
        <Box
          onClick={onClose}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(12, 18, 24, 0.68)",
          }}
        >
          <Box
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            sx={{
              width: "min(92vw, 980px)",
              maxHeight: "92vh",
              overflow: "hidden",
              outline: "none",
              p: { xs: 1.5, md: 2 },
              borderRadius: "28px",
              backgroundColor: "rgba(255,255,255,0.96)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
            }}
          >
            {photoUrl && (
              <Box
                alt="Restaurant enlarged view"
                component="img"
                loading="eager"
                src={photoUrl}
                sx={{
                  width: "100%",
                  maxHeight: "76vh",
                  objectFit: "contain",
                  borderRadius: "20px",
                  display: "block",
                }}
              />
            )}
            <Stack
              alignItems={{ xs: "flex-start", sm: "center" }}
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={1}
              sx={{ pt: 1.5 }}
            >
              <Typography id="photo-modal-description" variant="body2">
                Tap outside the image to close the preview.
              </Typography>
              <Button onClick={onClose} variant="outlined">
                Close
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PhotoModal;
