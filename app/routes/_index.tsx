import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, MetaFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  Link,
} from "@remix-run/react";
import { useRef, useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// eslint-disable-next-line no-empty-pattern, @typescript-eslint/no-unused-vars
export const loader = async (args: LoaderFunctionArgs) => {
  const resp = [
    { id: 1, name: "USA" },
    { id: 2, name: "Canada" },
  ];
  return json({ countries: resp });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  console.log("\n", `name, code = `, name, code, "\n");

  return json({ message: "Country created", resp: { name, code } });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.message === "Country created") {
      console.log("\n", `formRef.current = `, formRef.current, "\n");
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl">Hello Portal Spike</h1>

      <ul>
        {loaderData.countries.map((country) => (
          <li key={country.id}>
            <Link
              to={`/countries/${country.id}`}
              className="text-blue-500 hover:underline"
            >
              {country.name}
            </Link>
          </li>
        ))}
      </ul>

      <Form method="post" ref={formRef} className="flex flex-col max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Add a new country</h2>
        <label className="block mb-2">
          <span className="text-gray-700">Name</span>
          <input type="text" name="name" />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Code</span>
          <input type="text" name="code" />
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Form>
    </div>
  );
}
