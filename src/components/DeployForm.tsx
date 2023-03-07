import { usePolywrapInvoke } from "@cbrazon/react";
import { SAFE_FACTORY_URI } from "../client-config";
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
  Button,
  Spinner,
  Image,
  Box,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { Formik, Form, FieldArray, Field } from "formik";
import { useConnectedMetaMask } from "metamask-react";
import closeImg from "../images/close.svg";
//@ts-ignore
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import { addSafe } from "../utils/localstorage";

export default function DeployForm() {
  const { account } = useConnectedMetaMask();

  const { execute, loading } = usePolywrapInvoke<
    Record<string, unknown> & { safeAddress: string }
  >({
    uri: SAFE_FACTORY_URI,
    method: "deploySafe"
  });
  const navigate = useNavigate();

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
      if (!res.ok) {
        NotificationManager.error(
          "Check console for additional details",
          "Error"
        );
        console.log("error", res.error);
        return;
      }
      if (res.ok) {
        const safeAddress = res.value?.safeAddress;

        NotificationManager.success(
          `Your safe is deployed at: ${safeAddress}`,
          "Congratulations !"
        );

        console.log("success", res.value);
        addSafe(safeAddress);
        navigate("/0x3cbf4e1ce15f606ab9441358f1fa42bd96f27a3a/home");
      }
    });
  };

  const initialValues = { owners: [account], threshold: 1, newOwner: "" };

  return (
    <Box
      sx={{
        borderRadius: "10px",
        ".chakra-input__group, .chakra-numberinput": {
          background: "rgba(0, 20, 40, 0.04)",
          backdropFilter: "blur(20px)",
          borderRadius: "8px",
        },
      }}
    >
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
                      max={values.owners.length}
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
                          disabled={loading}
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
    </Box>
  );
}
