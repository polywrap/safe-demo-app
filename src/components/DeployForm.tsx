import { usePolywrapInvoke } from "@polywrap/react";
import React, { useState } from "react";
import { SAFE_FACTORY_URI } from "../lib/polywrap/uris";
import {
  Input,
  InputRightElement,
  FormControl,
  FormLabel,
  InputGroup,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInput,
  Stack,
  Box,
  Button,
  Heading,
  Spinner,
  InputProps,
  Image,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

import { Formik, Form, FieldArray, Field } from "formik";
import { useConnectedMetaMask } from "metamask-react";
import closeImg from "../images/close.svg";
import {
  NotificationContainer,
  NotificationManager,
  //@ts-ignore
} from "react-notifications";
import Panel, { PanelHead } from "./Panel";

const MyInput = (props: InputProps) => {
  return <InputGroup></InputGroup>;
};
export default function DeployForm() {
  const { account } = useConnectedMetaMask();
  const { execute, loading } = usePolywrapInvoke<
    Record<string, unknown> & { safeAddress: string }
  >({
    uri: SAFE_FACTORY_URI,
    method: "deploySafe",
  });
  const [resultAddress, setResultAddress] = useState<string[]>([]);

  const handleOnSubmit = (v: typeof initialValues) => {
    execute({
      safeAccountConfig: {
        owners: v.owners.filter(Boolean),
        threshold: v.threshold,
      },
      safeDeploymentConfig: {
        saltNonce: Date.now().toString(),
      },
    }).then((res) => {
      if (res.error) {
        NotificationManager.error(
          "Check console for additional details",
          "Error"
        );
        console.log("error", res.error);
        return;
      }
      if (res.data) {
        const safeAddress = res.data?.safeAddress;

        NotificationManager.success(
          `Your safe is deployed at: ${safeAddress}`,
          "Congratulations !"
        );
        setResultAddress((state) => [...state, safeAddress]);
        console.log("success", res.data);
        return;
      }
    });
  };

  const initialValues = { owners: [account], threshold: 1, newOwner: "" };

  return (
    <PanelHead
      sx={{
        borderRadius: "10px",
        p: "60px",
        ".chakra-input__group, .chakra-numberinput": {
          background: "rgba(0, 20, 40, 0.04)",
          backdropFilter: "blur(20px)",
          borderRadius: "8px",
        },
      }}
    >
      <Heading sx={{ mb: "50px" }}>Safe Deployer</Heading>
      <Formik initialValues={initialValues} onSubmit={handleOnSubmit}>
        {({ values, errors }) => (
          <Form>
            <Field id="threshold" name="threshold">
              {({ field, form }: any) => (
                <FormControl sx={{ width: "fit-content" }}>
                  <FormLabel>
                    Threshold
                    <NumberInput
                      min={0}
                      {...field}
                      onChange={(val) =>
                        form.setFieldValue(field.name, Number(val))
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormLabel>
                </FormControl>
              )}
            </Field>
            {/* @ts-ignore */}
            <FieldArray id="owners" name="owners">
              {({ insert, remove, push }) => (
                <FormLabel>
                  Owners
                  <Stack>
                    {values.owners.length > 0 &&
                      values.owners.map((owner, index) => (
                        <Field
                          name={`owners.${index}`}
                          key={`owners.${index}`}
                          placeholder="Owner's address"
                          type="text"
                        >
                          {({ field, form }: any) => (
                            <FormControl>
                              <InputGroup>
                                <Input {...field} placeholder="Address" />
                                <InputRightElement>
                                  <Image
                                    src={closeImg}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => remove(index)}
                                  />
                                </InputRightElement>
                              </InputGroup>
                            </FormControl>
                          )}
                        </Field>
                      ))}
                    <FormControl>
                      <FormLabel>
                        <Button
                          type="button"
                          mr={4}
                          onClick={() => push("")}
                          disabled={values.threshold <= values.owners.length}
                        >
                          <AddIcon />
                        </Button>
                        Add owner
                      </FormLabel>
                    </FormControl>
                  </Stack>
                </FormLabel>
              )}
            </FieldArray>

            <Button disabled={loading} type="submit">
              {loading ? <Spinner /> : "Deploy Safe"}
            </Button>
          </Form>
        )}
      </Formik>
      {Boolean(resultAddress.length) && (
        <Box mt={10}>
          <Heading size={"md"}>Deployed safes:</Heading>
          <Stack>
            {resultAddress.map((addr) => (
              <Box>{addr}</Box>
            ))}
          </Stack>
        </Box>
      )}

      <NotificationContainer />
    </PanelHead>
  );
}
