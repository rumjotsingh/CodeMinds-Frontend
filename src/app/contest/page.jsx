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
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Contests</h1>
          <p className="text-sm text-[#eff1f6bf]">
            Participate in programming contests to test your skills
          </p>
        </header>

        {contests?.length === 0 ? (
          <div className="text-center text-[#eff1f6bf] py-20">
            No contests available.
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((contest, index) => {
              const status = getContestStatus(contest.startTime, contest.endTime);

              return (
                <div
                  key={index}
                  className="border border-[#303030] rounded-lg bg-[#282828] hover:bg-[#303030]/50 transition"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{contest.title}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              status === 'Upcoming'
                                ? 'bg-[#00b8a3]/20 text-[#00b8a3]'
                                : status === 'Ongoing'
                                ? 'bg-[#ffc01e]/20 text-[#ffc01e]'
                                : 'bg-[#303030] text-[#eff1f6bf]'
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-sm text-[#eff1f6bf]">{contest.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-[#eff1f6bf] mb-3">
                      <span>
                        <strong className="text-[#eff1f6]">Start:</strong> {new Date(contest.startTime).toLocaleString()}
                      </span>
                      <span>
                        <strong className="text-[#eff1f6]">End:</strong> {new Date(contest.endTime).toLocaleString()}
                      </span>
                    </div>

                    {/* Problems */}
                    {contest.problems && contest.problems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Problems ({contest.problems.length})</h4>
                        <div className="space-y-1">
                          {contest.problems.map((problem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-3 py-2 rounded bg-[#1a1a1a] hover:bg-[#303030] text-sm"
                            >
                              <span>{problem.title}</span>
                              {problem.difficulty && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    problem.difficulty === 'EASY'
                                      ? 'bg-[#00b8a3]/20 text-[#00b8a3]'
                                      : problem.difficulty === 'MEDIUM'
                                      ? 'bg-[#ffc01e]/20 text-[#ffc01e]'
                                      : 'bg-[#ff375f]/20 text-[#ff375f]'
                                  }`}
                                >
                                  {problem.difficulty}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        disabled={status === 'Ended'}
                        className="h-8"
                      >
                        {status === 'Ongoing' ? 'Join Contest' : status === 'Upcoming' ? 'Register' : 'View Results'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
