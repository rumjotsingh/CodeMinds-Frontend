'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags } from '../redux/slices/problemSlice';
import { Badge } from '@/components/ui/badge';

export default function TagsSidebar() {
  const dispatch = useDispatch();
  const { tags, tagsStatus, tagsError } = useSelector((state) => state.problem);
  const [companyTags, setCompanyTags] = useState([]);
  const [dsaTags, setDsaTags] = useState([]);

  const companyList = new Set([
    "Apple", "Atlassian", "Bloomberg", "Cisco", "Facebook",
    "Goldman Sachs", "Google", "Infosys", "JP Morgan", "Microsoft", "Oracle",
    "Paypal", "TCS", "Uber", "VM Ware", "Zoho",
  ]);

  useEffect(() => {
    if (tagsStatus === 'idle') {
      dispatch(fetchTags());
    }
  }, [tagsStatus, dispatch]);

  useEffect(() => {
    if (tagsStatus === 'succeeded' && tags.length > 0) {
      const companies = [];
      const dsa = [];

      tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        if (companyList.has(tag) || normalizedTag === 'tcs') {
          companies.push(tag === 'Tcs' ? 'TCS' : tag);
        } else {
          dsa.push(tag);
        }
      });

      setCompanyTags(companies);
      setDsaTags(dsa);
    }
  }, [tagsStatus, tags]);

  // Skeleton loader component for badges
  const SkeletonBadge = () => (
    <span className="inline-block w-16 h-6 bg-gray-700 rounded-md animate-pulse"></span>
  );

  return (
    <aside className="p-4 w-full md:min-w-[200px] border-r h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">All Tags</h2>

      {tagsStatus === 'loading' && (
        <>
          <section className="mb-6">
            <h3 className="font-semibold text-yellow-500 mb-2">Company Tags</h3>
            <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto pr-1">
              {/* Show 8 skeleton badges for company */}
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonBadge key={`company-skeleton-${i}`} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-yellow-500 mb-2">DSA Concept Tags</h3>
            <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto pr-1">
              {/* Show 12 skeleton badges for DSA concepts */}
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonBadge key={`dsa-skeleton-${i}`} />
              ))}
            </div>
          </section>
        </>
      )}

      {tagsStatus === 'failed' && <p className="text-sm text-red-500">{tagsError}</p>}

      {tagsStatus === 'succeeded' && (
        <>
          <section className="mb-6">
            <h3 className="font-semibold text-yellow-500 mb-2">Company Tags</h3>
            <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto pr-1">
              {companyTags.length > 0 ? (
                companyTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-primary hover:text-white transition"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No company tags found.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-yellow-500 mb-2">DSA Concept Tags</h3>
            <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto pr-1">
              {dsaTags.length > 0 ? (
                dsaTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-primary hover:text-white transition"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No DSA concept tags found.</p>
              )}
            </div>
          </section>
        </>
      )}
    </aside>
  );
}
