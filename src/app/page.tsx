'use client';

import { SyntheticEvent, useEffect, useState } from 'react';

type Advocates = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}[];

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocates>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocates>([]);

  useEffect(() => {
    fetch('/api/advocates').then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const searchFor = (item: string, query: string) =>
    item.toLowerCase().includes(query.toLowerCase());

  const onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;

    setSearchTerm(searchTerm);

    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        searchFor(advocate.firstName, searchTerm) ||
        searchFor(advocate.lastName, searchTerm) ||
        searchFor(advocate.city, searchTerm) ||
        searchFor(advocate.degree, searchTerm) ||
        advocate.specialties.some((s) => searchFor(s, searchTerm)) ||
        searchFor(advocate.yearsOfExperience.toString(), searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setSearchTerm('');
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="m-6">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <input
          className="border border-black"
          onChange={onChange}
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}-${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
