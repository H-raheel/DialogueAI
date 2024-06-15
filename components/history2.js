import React from 'react';
import { useQuery } from 'react-query';
import Table from './table';
import Link from 'next/link';
import { useTable } from 'react-table';
import { useRouter } from 'next/router';
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect } from 'react';

const HistoryTable = () => {
  // Define a query function to fetch history data from the backend
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();
  const { user, googleSignIn, logOut } = UserAuth() || {};
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(true);
        return;
      }
      setLoading(true);
      const uid = user.uid;
      try {
        const response = await fetch('/api/get_history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
        const fetchedData = await response.json();
        var data = fetchedData['data'];
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Date of Creation',
        accessor: 'date',
      },
      {
        Header: 'Predicted Price',
        accessor: 'price',
      }
    ],
    []
  );

  function onClick(i) {
    var id = data[i].id;
    router.push('/details/' + id)
  }

  const tableInstance = useTable({
    columns,
    data: data || [], // Ensure data is defined or use an empty array
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-5xl font-bold">History</h1>
      <br />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table {...getTableProps()} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className='px-6 py-3' scope='col'>{column.render('Header')}</th>
                ))}
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <>
                  {/* Use Link to wrap the row and navigate to the details page */}
                  <tr {...row.getRowProps()} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className='px-6 py-4'>{cell.render('Cell')}</td>
                    ))}
                    <td>
                      {/* Add a button to the right side of each row */}
                      <button onClick={(e) => onClick(i)} className="px-6 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
