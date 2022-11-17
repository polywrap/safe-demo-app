import { Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import { useInvokeManager } from "../hooks";
import { SAFE_TRANSACTIONS } from "../modules/router/routes";
import { Transaction } from "../types";
import { addPendingTransaction } from "../utils/localstorage";

interface SendTxValues {
  recepient: string;
  asset: string;
  amount: number;
}

export default function Send() {
  const [createTransaction, { loading }] =
    useInvokeManager<Transaction>("createTransaction");

  const navigate = useNavigate();
  const params = useParams();

  const safeAddressParam = params.safe!;

  const handleSubmit = async (values: SendTxValues) => {
    createTransaction({
      tx: { data: "0x", to: values.recepient, value: values.amount.toString() },
    })
      .then((res) => {
        if (res.ok) {
          addPendingTransaction(safeAddressParam, res.value);
        }
      })
      .then((res) => navigate(`/${safeAddressParam}/${SAFE_TRANSACTIONS}`));
  };

  return (
    <Box>
      <Formik<SendTxValues>
        initialValues={{ recepient: "", asset: "ETH", amount: 0 }}
        onSubmit={handleSubmit}
      >
        {({ values, errors }) => (
          <Form>
            <Field id="recepient" name="recepient">
              {({ field, form }: any) => (
                <FormLabel>
                  Recepient
                  <Input {...field} />
                </FormLabel>
              )}
            </Field>
            <Field id="asset" name="asset">
              {({ field, form }: any) => (
                <FormLabel>
                  Asset
                  <Input readOnly {...field} />
                </FormLabel>
              )}
            </Field>
            <Field id="amount" name="amount">
              {({ field, form }: any) => (
                <FormLabel>
                  Amount
                  <Input type="number" {...field} />{" "}
                </FormLabel>
              )}
            </Field>
            <Button type="submit" disabled={loading}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
