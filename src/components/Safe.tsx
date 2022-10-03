import { usePolywrapClient, usePolywrapInvoke } from "@polywrap/react";
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
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

import { Formik, Form, FieldArray, Field } from "formik";
import { useConnectedMetaMask } from "metamask-react";

import {
  NotificationContainer,
  NotificationManager,
  //@ts-ignore
} from "react-notifications";

export default function Safe() {
  const { account } = useConnectedMetaMask();
  const { execute, loading, data, error } = usePolywrapInvoke<
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

  const initialValues = { owners: [account], threshold: 1 };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleOnSubmit}>
        {({ values, errors }) => (
          <Form>
            <Field id="threshold" name="threshold">
              {({ field, form }: any) => (
                <FormControl>
                  <FormLabel>
                    Threshold
                    <NumberInput
                      min={0}
                      {...field}
                      onChange={(val) => form.setFieldValue(field.name, val)}
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
                                  <Button
                                    type="button"
                                    className="secondary"
                                    onClick={() => remove(index)}
                                  >
                                    <CloseIcon />
                                  </Button>
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
                          className="secondary"
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
              Deploy Safe
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
    </>
  );
}
