import React from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    maxWidth?: string;
    minWidth?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = "Search...", 
    value, 
    onChange,
    maxWidth = '400px',
    minWidth = '250px'
}) => {
    return (
        <InputGroup style={{ maxWidth, minWidth }}>
            <FormControl
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    backgroundColor: '#0d0c18',
                    border: '1px solid #151321',
                    borderRadius: '8px',
                    color: '#dae6f2d1',
                    padding: '10px 15px',
                    outline: 'none',
                    boxShadow: 'none'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(224, 211, 24, 0.8)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#151321';
                }}
            />
            {value && (
                <Button
                    variant="outline-secondary"
                    onClick={() => onChange('')}
                    style={{
                        backgroundColor: '#0d0c18',
                        border: '1px solid #151321',
                        borderLeft: 'none',
                        borderRadius: '0 8px 8px 0',
                        color: '#e0d318',
                        marginLeft: '-1px'
                    }}
                >
                    ✕
                </Button>
            )}
        </InputGroup>
    );
};