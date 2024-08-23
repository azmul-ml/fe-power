import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import DataHandler from "./DataHandler";
import { IconUpload } from "@tabler/icons-react";

export default function DataHandle() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal size={700} opened={opened} onClose={close} title="Import Your Data Here...">
        <DataHandler />
      </Modal>

      <Button
        variant="gradient"
        leftSection={<IconUpload size={14} />}
        onClick={open}
      >
        Data
      </Button>
    </>
  );
}
