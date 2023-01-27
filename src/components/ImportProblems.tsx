import { useDisclosure, useToast, Link, Input, Text, Popover, PopoverTrigger, Flex, Icon, PopoverContent, PopoverArrow, PopoverCloseButton, Stack, FormControl, FormLabel, ButtonGroup, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, FormHelperText } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { CiImport } from 'react-icons/ci';
import { trpc } from '../utils/trpc';

const ImportProblems: React.FC = () => {
  const { status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [importLink, setImportLink] = useState("");

  const mut = trpc.import.importProblems.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      if (error.data?.httpStatus === 400) {
        toast({
          status: "error",
          title: "Invalid URL",
          description: "Please enter a valid URL!"
        })
      } else if (error.data?.httpStatus === 500) {
        toast({
          status: "error",
          title: "An error occurred",
          description: "Internal Server Error"
        })
      } else {
        toast({
          status: "error",
          title: "An error occurred",
          description: error.message
        })
      }
    },
  });
  const toast = useToast();

  const handleImportClick = () => {
    if (importLink.match(/oichecklist.pythonanywhere.com\/view\/\d*[a-zA-Z][a-zA-Z0-9]*/g)?.length === undefined) {

      toast({
        title: 'Invalid input',
        description: "Please enter a valid link!",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })

      return;
    }
    if (mut.isLoading) return;
    mut.mutate({
      link: importLink
    });
  };

  return status === "authenticated"
    ? (
      <>
        <Flex
          mb={3}
          p={3}
          borderRadius="5px"
          alignItems="center"
          transition="all 0.2s ease-in-out"
          _hover={{ bg: "rgba(221,226,255, 0.08)" }}
          cursor="pointer"
          onClick={onOpen}
        >
          <Icon boxSize={7} as={CiImport} />
          <Text ml={3} fontSize="16px">
            Import Progress
          </Text>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Import from OI Checklist</ModalHeader>
            <ModalCloseButton disabled={mut.isLoading} />

            <ModalBody>
              <FormControl>
                <FormLabel fontWeight="bold" color="black" mb={0}>Existing Link</FormLabel>
                <FormHelperText mt={0}>Please be patient. This may take a while.</FormHelperText>
                <Input mt={2} type="text" size="md" placeholder="enter your checklist link!" color="black" onChange={(e) => setImportLink(e.target.value)} disabled={mut.isLoading} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <ButtonGroup display='flex' justifyContent='flex-end'>
                <Button variant='outline' onClick={onClose} disabled={mut.isLoading} textColor="black">
                  Cancel
                </Button>
                <Button colorScheme='teal' onClick={handleImportClick} disabled={mut.isLoading} isLoading={mut.isLoading}>
                  Import
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
    : (<></>);
  // (
  //   <Popover
  //     isOpen={isOpen}
  //     initialFocusRef={firstFieldRef}
  //     onOpen={onOpen}
  //     onClose={onClose}
  //     placement='right'
  //     closeOnBlur={false}
  //   >
  //     <PopoverTrigger>
  //       <Link href="/">
  //         <Flex
  //           mb={3}
  //           p={3}
  //           borderRadius="5px"
  //           alignItems="center"
  //           transition="all 0.2s ease-in-out"
  //           _hover={{ bg: "rgba(221,226,255, 0.08)" }}
  //         >
  //           <Icon boxSize={7} as={CiImport} />
  //           <Text ml={3} fontSize="16px">
  //             Import Progress
  //           </Text>
  //         </Flex>
  //       </Link>
  //     </PopoverTrigger>
  //     <PopoverContent p={5}>
  //       <FocusLock returnFocus persistentFocus={false}>
  //         <PopoverArrow />
  //         <PopoverCloseButton color="black" />
  //         <Stack spacing={4}>
  //           <FormControl>
  //             <FormLabel fontWeight="bold" color="black">Existing Link</FormLabel>
  //             <Input type="text" size="md" placeholder="enter your checklist link!" color="black" onChange={(e) => setImportLink(e.target.value)} />
  //           </FormControl>
  //           <ButtonGroup display='flex' justifyContent='flex-end'>
  //             <Button variant='outline' onClick={onClose} textColor="black">
  //               Cancel
  //             </Button>
  //             <Button colorScheme='teal' onClick={() => handleImportClick()} isLoading={mut.isLoading}>
  //               Import
  //             </Button>
  //           </ButtonGroup>
  //         </Stack>
  //       </FocusLock>
  //     </PopoverContent>
  //   </Popover>
  // )
}

export default ImportProblems;