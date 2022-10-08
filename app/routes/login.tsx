import {
  Center,
  Text,
  Box,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { db } from "~/utils/db.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Step, Steps, useSteps } from "chakra-ui-steps";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const address = form.get("address");

  if (!address || typeof address !== "string") return null;

  return redirect(`/dashboard`);
};

export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany();

  console.log(users);

  return null;
};

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const steps = [
    { label: "Connect wallet" },
    { label: "Sign in in Lens protocol" },
  ];

  const { nextStep, activeStep, reset } = useSteps({
    initialStep: 0,
  });

  const handleNext = async () => {
    nextStep();
  };

  return (
    <Box>
      <Box>
        <Center>
          <Text
            fontSize="30px"
            fontWeight={700}
            mt="30"
            color="primary"
            align="center"
            pt={20}
            pb={5}
          >
            The autentication <br /> for all the world
          </Text>
        </Center>
      </Box>
      <Box>
        <Center>
          <Box boxSize="270px" pt={20}>
            <Image
              src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F9d4db6f3-c0f4-42e1-a0f2-862776ae0c92%2Flogin-box.png?table=block&id=e9d62a02-5780-4646-9d7d-3d7b5ba464e3&spaceId=44514f37-bf45-41b8-90cd-647cbf4961f7&width=1730&userId=f6eb0ab4-bc9f-402b-b477-e57a6aa6ecc6&cache=v2"
              alt="hola"
            />
          </Box>
        </Center>
      </Box>
      <Box pt={40}>
        <Center>
          <Button
            backgroundColor={"#1E7EFD"}
            width="350px"
            height="70px"
            color="white"
            rounded={"full"}
            fontSize="23px"
            onClick={onOpen}
          >
            Wallet Connect
          </Button>
        </Center>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Box>
              <Steps
                labelOrientation="vertical"
                activeStep={activeStep}
                responsive={false}
                size={"sm"}
              >
                {steps.map(({ label }) => (
                  <Step label={label} key={label}></Step>
                ))}
              </Steps>
            </Box>

            <Text fontSize="26px" fontWeight="bold">
              Connect your wallet
            </Text>

            <Text>
              Connect with one of our available wallet providers or create a new
              one
            </Text>
          </ModalBody>

          <Center p="5">
            <Button
              backgroundColor="second"
              color="white"
              rounded={"full"}
              fontSize="18px"
              width="50%"
              onClick={handleNext}
            >
              Conectar wallet
            </Button>
          </Center>
        </ModalContent>
      </Modal>
    </Box>
  );
}
