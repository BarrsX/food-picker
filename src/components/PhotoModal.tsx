import React from 'react';
import { Box, Modal, Typography } from '@mui/material';

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
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        sx={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={onClose}
      >
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Restaurant enlarged view"
            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)', transition: 'transform 0.3s ease-in-out' }}
          />
        )}
        <Typography id="photo-modal-description" variant="caption" sx={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem' }}>
        </Typography>
      </Box>
    </Modal>
  );
};

export default PhotoModal;
