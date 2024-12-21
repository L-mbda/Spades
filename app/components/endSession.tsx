'use client';

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function EndSession() {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="End Session" centered>
                <Modal.Body>
                    <h1 className='font-extrabold text-[22.5px]'>End Session</h1>
                    <p>Are you sure you want to end the session?</p>    
                    <section className="flex flex-row gap-3">
                        <Button color="red" onClick={() => {
                            // @ts-ignore
                            localStorage.removeItem('sessionData');
                            localStorage.removeItem('gameStore');
                            localStorage.removeItem('winner');
                            close();
                            window.location.reload();
                        }}>End Session</Button>
                        <Button onClick={close}>Cancel</Button>
                    </section>
                </Modal.Body>                
            </Modal>
            <Button color="red" onClick={open}>End Session</Button>       
        </>
    )
}