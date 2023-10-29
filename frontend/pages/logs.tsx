import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logStore } from '@/stores/LogStore';
import { promptStore } from '@/stores/PromptStore';
import { modelStore } from '@/stores/ModelStore';

export default function About() {
  const { push } = useRouter();

  var { logs, fetchLogs } = logStore();
  var { models } = modelStore();
  var { prompts } = promptStore();

  const initial_page = parseInt(location.search.replace('?page=', ''));

  const [page, setPage] = useState(initial_page || 1);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  const handleRowClick = (logId:string) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [logId]: !(prevExpandedRows as any)[logId],
    }));
  };

  const handlePrevious = () => {
    if (page > 1) push(`?page=${page - 1}`);
    setPage(page - 1);
    //fetchLogs(page);
  };

  const handleNext = () => {
    if (page) push(`?page=${page + 1}`);
    setPage(page + 1);
    //fetchLogs(page);
  };

  function getModelName(id:string) {
    return models.find((model:any) => model.id === id)?.name || "N/a";
  }

  function getPromptName(id:string) {
    return prompts.find((prompt:any) => prompt.id === id)?.name || "N/a";
  }

  const renderRow = (log: any) => (
    <>
      <tr key={log.id} onClick={() => handleRowClick(log.id)} className="cursor-pointer">
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
          {getPromptName(log.prompt_id)}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getModelName(log.model_id)}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{(log.createdAt.toString())}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{(log.duration || 0)}</td>
        <td
          className={`whitespace-nowrap px-3 py-4 text-sm ${
            log.status && log.status !== 200 ? 'bg-yellow-300' : '' // Add your yellow background class here
          } text-gray-500`}
        >
          {log.status}
        </td>
      </tr>
      {(expandedRows as any)[log.id] && (
        <tr>
          <td colSpan={5} className="bg-gray-100">
          {
            // If there's no error in log.error
            !log.error && log.data ? (
              <div className="flex">
                <div className="w-1/2 p-4" style={{ whiteSpace: 'pre-wrap' }}>
                  {log.data.prompt != undefined || log.data.context != undefined ? (
                    <div className="mb-4">
                      <fieldset className="border p-2">
                        <legend  className="w-auto">
                          {log.data.context ? 'context' : 'prompt'}
                        </legend>
                        <p>{log.data.prompt || log.data.context}</p>
                      </fieldset>
                    </div>
                  ) : null}
                  {log.data.messages ? (
                    <div className="mb-4">
                      {log.data.messages.map((message:any, index:any) => (
                        <fieldset className="border p-2" key={index}>
                          <legend  className="w-auto">{message.role}</legend>
                          <p>{message.content}</p>
                        </fieldset>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Display log.message */}
                <div className="w-1/2 p-4" style={{ whiteSpace: 'pre-wrap' }}>
                  {
                    typeof log.message === 'string' ? (
                      <fieldset className="border p-2">
                        <legend  className="w-auto">output</legend>
                        <p>{log.message}</p>
                      </fieldset>
                    ) : (
                      <fieldset className="border p-2">
                        <legend  className="w-auto">{log.message.role}</legend>
                        <p>{log.message.content}</p>
                      </fieldset>
                    )
                  }
                </div>
              </div>
            ) 
            : 
            // If there's an error in log.error
            (
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(log, null, 2)}
              </pre>
            )
          }
          </td>
        </tr>
      )}
    </>
  );  

  return (
    //style with border 1px solid red
    <div style={{ border: '1px solid red', flex: 1}}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Logs</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the logs that have been generated by the system.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          </div>
        </div>
        <div className="mt-8 flow-root markdown-page markdown-content markdown-prompt-blockquote models">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full docs-models-toc">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Prompt
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Model
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {logs && (logs as any).data ? (logs as any).data.map((log:any) => renderRow(log)) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{page*(logs as any).per_page-10}</span> to <span className="font-medium">{Math.min(page * (logs as any).per_page, (logs as any).total)}</span> of{' '}
            <span className="font-medium">{(logs as any).total}</span> results
          </p>
        </div>

          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              onClick={handlePrevious}
              className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 ${page === 1 && "opacity-50 cursor-not-allowed"}`}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className={`relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 ${(logs as any).total_pages === page && "opacity-50 cursor-not-allowed"}`}
              disabled={(logs as any).total_pages === page}
            >
              Next
            </button>
          </div>
        </nav>

    </div>
  );
}
