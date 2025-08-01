'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProblems, fetchTags } from '../../redux/slices/problemSlice';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProblemsList() {
  const dispatch = useDispatch();
  const { items: problems, status, tags, error } = useSelector((state) => state.problem);

  const [difficultyFilter, setDifficultyFilter] = useState({
    EASY: false,
    MEDIUM: false,
    HARD: false,
  });

  const [statusFilter, setStatusFilter] = useState({
    Solved: false,
    Unsolved: false,
  });

  const [difficultyTouched, setDifficultyTouched] = useState(false);
  const [statusTouched, setStatusTouched] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProblems());
    dispatch(fetchTags());
  }, [status, dispatch]);

  const getBadgeColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-200 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-200 text-yellow-800';
      case 'HARD':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const filteredProblems = useMemo(() => {
  // If no filters are touched OR all checkboxes are unchecked
  const noDifficultySelected = Object.values(difficultyFilter).every((v) => !v);
  const noStatusSelected = Object.values(statusFilter).every((v) => !v);

  // Show all problems if no filters selected
  if (noDifficultySelected && noStatusSelected) {
    return problems;
  }

  return problems?.filter((problem) => {
    const isDifficultyMatch = noDifficultySelected || difficultyFilter[problem.difficulty];
    const isStatusMatch = noStatusSelected || statusFilter['Unsolved']; // Replace with dynamic logic if needed
    return isDifficultyMatch && isStatusMatch;
  });
}, [problems, difficultyFilter, statusFilter]);


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="mb-6">
            <p className="font-medium mb-2">Difficulty</p>
            {['EASY', 'MEDIUM', 'HARD'].map((level) => (
              <label key={level} className="flex items-center space-x-2 mb-1">
                <Checkbox
                  checked={difficultyFilter[level]}
                  onCheckedChange={() => {
                    setDifficultyTouched(true);
                    setDifficultyFilter((prev) => ({
                      ...prev,
                      [level]: !prev[level],
                    }));
                  }}
                />
                <span>{level}</span>
              </label>
            ))}
          </div>

        <div>
  <p className="font-medium mb-2">Status</p>

  {/* Unsolved */}
  <label className="flex items-center space-x-2 mb-1">
    <Checkbox
      checked={statusFilter['Unsolved']}
      onCheckedChange={() => {
        setStatusFilter({
          Solved: false,
          Unsolved: !statusFilter['Unsolved'],
        });
      }}
    />
    <span>Unsolved</span>
  </label>

  {/* Solved */}
  <label className="flex items-center space-x-2 mb-1">
    <Checkbox
      checked={statusFilter['Solved']}
      onCheckedChange={() => {
        setStatusFilter({
          Solved: !statusFilter['Solved'],
          Unsolved: false,
        });
      }}
    />
    <span>Solved</span>
  </label>
</div>

        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {status === 'loading' && (
            <div className="space-y-4">
              {[...Array(20)].map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-5 gap-4 items-center py-2"
                >
                  <Skeleton className="h-6 w-full col-span-2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          )}

          {status === 'failed' && (
            <p className="text-red-600">Error: {error}</p>
          )}

          {status === 'succeeded' && (
            <>
              {filteredProblems?.length === 0 ? (
                <p className="text-gray-500">No matching problems found.</p>
              ) : (
                <Table className="mt-4">
                  <TableCaption>List of coding problems</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Problem</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Add to Sheets</TableHead>
                      <TableHead>Solve</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProblems.map((problem) => (
                      <TableRow key={problem._id}>
                        <TableCell className="font-medium">
                          {problem.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-medium px-2 py-1 rounded ${getBadgeColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Unsolved</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="secondary" size="sm">
                            Add
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm">
                            <a href={`/problem/${problem._id}`} target="_blank">
                              Solve
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
