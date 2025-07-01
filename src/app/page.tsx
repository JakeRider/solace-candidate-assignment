'use client';

import { SyntheticEvent, useEffect, useState } from 'react';

import styles from './page.module.css';

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
    <main className={styles.main}>
      <h1 className={styles.h1}>Solace Advocates</h1>
      <div className={styles.searchBar}>
        <label htmlFor="advocateSearch">Advocate search</label>
        <input
          className={styles.input}
          onChange={onChange}
          value={searchTerm}
          placeholder="Search..."
          alt="Advocate search"
          id="advocateSearch"
        />
        <button onClick={onClick}>Reset Search</button>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
      </div>
      <table className={styles.table}>
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
                  <ul>
                    {advocate.specialties.map((s) => (
                      <li key={`${advocate.id}-${s}`}>{s}</li>
                    ))}
                  </ul>
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
