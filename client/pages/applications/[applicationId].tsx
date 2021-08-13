import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "urql";

const FindOneApplication = `
    query($id: Float!) {
        findApplication(id: $id) {
            writing
            additionalInfo
            honorArr
        }
    }
`;

function applicationId() {
  const router = useRouter();
  const { applicationId: appId } = router.query;
  const [appResult, reexecuteApp] = useQuery({
    query: FindOneApplication,
    variables: { id: parseInt(appId as string) },
    pause: !appId,
  });
  const { data: appData, fetching: appFetching, error: appError } = appResult;
  console.log(appData);
  return (
    <main>
      {appData ? (
        <div>
          This is an app
          <h1>{appId}</h1>
          {appFetching
            ? "Loading..."
            : appData.findApplication.honorArr.map((honor) => {
                return <h1 key={honor}>{honor}</h1>;
              })}
          {appFetching ? "Loading..." : null}
        </div>
      ) : (
        "Error"
      )}
    </main>
  );
}

export default applicationId;
