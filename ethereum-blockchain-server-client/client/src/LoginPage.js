import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { colors as c } from "./colors";

const ErrorMessage = ({ message }) => {
  return (
    <Box my={4}>
      <Alert status="error" borderRadius={4}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      setIsLoggedIn(true);
      setIsLoading(false);
      history.push("/smarthome");
    } catch (error) {
      setError("Invalid username or password");
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Flex
      width="full"
      align="center"
      justifyContent="center"
      minHeight="100vh"
      bg={c.midnightBlue}
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={c.white}
      >
        {isLoggedIn ? (
          <Box textAlign="center">
            <Text>{email} logged in!</Text>
            <Button
              variantColor="orange"
              variant="outline"
              width="full"
              mt={4}
              onClick={() => setIsLoggedIn(false)}
            >
              Sign out
            </Button>
          </Box>
        ) : (
          <>
            <Box textAlign="center">
              <Heading>Login</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} />}
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="test"
                    size="lg"
                    onChange={(event) => setEmail(event.currentTarget.value)}
                  />
                </FormControl>
                <FormControl isRequired mt={6}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={"password"}
                      placeholder="*******"
                      size="lg"
                      onChange={(event) =>
                        setPassword(event.currentTarget.value)
                      }
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  variantColor="teal"
                  variant="outline"
                  type="submit"
                  width="full"
                  mt={4}
                >
                  {isLoading ? (
                    <CircularProgress
                      isIndeterminate
                      size="24px"
                      color="teal"
                    />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Box>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default LoginPage;
