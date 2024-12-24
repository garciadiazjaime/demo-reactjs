import { Suspense, use } from "react";

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

async function fetchMessages(): Promise<{ id: number; text: string }[]> {
    await sleep(2_000);

    return [
        {
            id: 1,
            text: "message 1",
        },
        {
            id: 2,
            text: "message 2",
        },
    ];
}

function Message({ messagePromise }: { messagePromise: Promise<{ id: number; text: string }[]> }) {
    const comments = use(messagePromise);

    return comments.map((comment) => (
        <p key={comment.id} style={{ margin: "20px 0" }}>
            {comment.text}
        </p>
    ));
}


export default function Page() {
    const messagePromise = fetchMessages();

    return (
        <div
            style={{
                maxWidth: 600,
                margin: "0 auto",
                fontSize: 22,
            }}
        >
            <h1 style={{ marginBottom: 40 }}>React 19: use</h1>

            <Suspense fallback={<p>⌛ waiting for messages...</p>}>
                <Message messagePromise={messagePromise} />
            </Suspense>
        </div>
    );
}
