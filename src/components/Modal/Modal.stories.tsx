import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../Button';
import { TextField } from '../TextField';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { open: false, onClose: () => {}, title: 'Archive this matter?' },
  parameters: {
    docs: {
      description: {
        component:
          'Built on the native <dialog> element with showModal(), so the page behind is inert and the dialog sits in the top layer. Adds initial focus, focus return to the trigger, Escape and backdrop close, all controlled by the `open` prop.',
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: function ConfirmStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Archive matter
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          size="sm"
          title="Archive this matter?"
          description="It moves to the archive and stops sending deadline reminders. You can restore it later."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Archive
              </Button>
            </>
          }
        />
      </>
    );
  },
};

export const WithForm: Story = {
  render: function FormStory() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Rename matter</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Rename matter"
          description="The new name shows on every report and invoice."
          closeOnBackdrop={false}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <TextField label="Matter name" defaultValue="Acme v. Globex" hint="Focus lands here when the dialog opens" />
        </Modal>
      </>
    );
  },
};
