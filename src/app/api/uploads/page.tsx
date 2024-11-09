"use client"

import { useState } from 'react';
import Papa from 'papaparse';

export default function UploadParticipants() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            Papa.parse(file, {
                complete: async (results) => {
                    await uploadDataToDatabase(results.data);
                },
                header: true,
            });
        }
    };

    const uploadDataToDatabase = async (data: any) => {
        return (
            <table className="border-collapse border border-slate-400">
                <thead>
                    <tr>
                        {Object.keys(data[0] || {}).map((header, index) => (
                            <th key={index} className="border border-slate-300 p-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex}>
                            {Object.values(row).map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} className="border border-slate-300 p-2">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}