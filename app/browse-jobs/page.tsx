import { getJobs } from '@/lib/api/jobs';



const BrowseJobPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

    const search = await searchParams;


    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString();
    console.log('search,', query);
    const jobs = await getJobs(query)


    return (
        <div>
            <h2>Browse job page</h2>

            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>{job.title}</li>
                ))}

            </ul>

        </div>
    );
};
export default BrowseJobPage;