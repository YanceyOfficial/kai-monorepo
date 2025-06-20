import {
  Button,
  DialogActions,
  DialogTitle,
  Paper,
  Popover
} from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { FC, ReactNode } from 'react'

interface Props {
  title?: string
  children?: ReactNode
  onOk: () => void
}

const ConfirmPopover: FC<Props> = ({ children, onOk, title }) => {
  return (
    <PopupState variant="popover" popupId="deleteOnePopover">
      {(popupState) => (
        <>
          <div style={{ cursor: 'pointer' }} {...bindTrigger(popupState)}>
            {children}
          </div>
          <Popover
            {...bindPopover(popupState)}
            disableRestoreFocus
          >
            <Paper>
              <DialogTitle>
                {title ? title : 'Are you sure you want to delete?'}
              </DialogTitle>
              <DialogActions>
                <Button onClick={popupState.close} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onOk()
                    popupState.close()
                  }}
                  color="primary"
                >
                  OK
                </Button>
              </DialogActions>
            </Paper>
          </Popover>
        </>
      )}
    </PopupState>
  )
}

export default ConfirmPopover
