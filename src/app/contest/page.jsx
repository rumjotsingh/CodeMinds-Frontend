'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContests } from '@/redux/slices/contestSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start > now) return 'Upcoming';
  if (start <= now && end > now) return 'Ongoing';
  return 'Ended';
};

const Contest = () => {
  const dispatch = useDispatch();
  const contests = useSelector((state) => state.contest.contests);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  return (
    <div className="min-h-screen py-12 px-4 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Contests</h1>
            <p className="text-muted-foreground text-lg">
              Browse upcoming and ongoing programming contests.
            </p>
          </div>
          <Badge className="mt-4 md:mt-0 text-base px-4 py-2 bg-primary text-primary-foreground">
            {contests?.length ?? 0} Contest{contests?.length !== 1 ? 's' : ''}
          </Badge>
        </header>
        {contests?.length === 0 ? (
          <div className="text-center text-muted-foreground py-20 text-xl">
            No contests available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {contests.map((contest, index) => {
              const status = getContestStatus(contest.startTime, contest.endTime);

              return (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-card border border-border text-foreground">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{contest.title}</span>
                      <Badge
                        className={
                          status === 'Upcoming'
                            ? 'bg-green-100 text-green-700'
                            : status === 'Ongoing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-muted text-muted-foreground'
                        }
                      >
                        {status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                      {contest.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="mr-4">
                        <strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}
                      </span>
                      <span>
                        <strong>End:</strong> {new Date(contest.endTime).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2 mt-3">Problems</h4>
                      <ul className="space-y-2">
                        {contest.problems.map((problem, idx) => (
                          <li
                            key={idx}
                            className="rounded bg-muted px-3 py-1 flex justify-between items-center hover:bg-primary/10 transition cursor-pointer"
                          >
                            <span className="font-medium text-foreground">
                              {problem.title}
                            </span>
                            {problem.difficulty && (
                              <Badge
                                className={`ml-2 ${problem.difficulty === 'EASY'
                                  ? 'bg-green-200 text-green-800'
                                  : problem.difficulty === 'MEDIUM'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-red-200 text-red-800'
                                  }`}
                              >
                                {problem.difficulty}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        disabled={status !== 'Ongoing'}
                        variant={status === 'Ongoing' ? 'default' : 'outline'}
                        className={status === 'Ongoing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-border'}
                      >
                        {status === 'Upcoming'
                          ? 'Not Started Yet'
                          : status === 'Ongoing'
                          ? 'Participate'
                          : 'Ended'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
