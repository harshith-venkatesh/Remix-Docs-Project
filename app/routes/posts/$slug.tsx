import { LoaderFunction, useLoaderData } from "remix"

export const loader: LoaderFunction = async ({params}) => {
    return params.slug;
}
export default function PostSlug() {
    const slug = useLoaderData();
    return (
        <div>
            <h1>Some Posts: {slug}</h1>
        </div>
    )
}