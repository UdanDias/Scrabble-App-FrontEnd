import React from 'react';

interface DataCountProps {
    label: string;
    totalCount: number;
    filteredCount?: number;
    showFiltered?: boolean;
}

export const DataCount: React.FC<DataCountProps> = ({ 
    label, 
    totalCount, 
    filteredCount, 
    showFiltered = false 
}) => {
    return (
        <div style={{
            color: '#e0d318',
            fontSize: '16px',
            fontWeight: '500'
        }}>
            {label}: <span style={{ color: '#dae6f2d1', fontWeight: 'bold' }}>{totalCount}</span>
            {showFiltered && filteredCount !== undefined && filteredCount !== totalCount && (
                <span style={{ marginLeft: '15px', color: '#bfd0e1', fontSize: '14px' }}>
                    (Showing {filteredCount} of {totalCount})
                </span>
            )}
        </div>
    );
};