import React from 'react';

interface SimpleCalendarProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ selectedDate, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = React.useState(
        selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
    );

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onDateSelect(newDate);
    };

    const isSelectedDate = (day: number) => {
        if (!selectedDate) return false;
        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return (
            checkDate.getDate() === selectedDate.getDate() &&
            checkDate.getMonth() === selectedDate.getMonth() &&
            checkDate.getFullYear() === selectedDate.getFullYear()
        );
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = isSelectedDate(day);
        days.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                        ? 'bg-[#46a1bb] text-white font-bold'
                        : 'hover:bg-gray-100 text-gray-700'
                }`}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    ←
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(name => (
                    <div key={name} className="text-center text-xs font-semibold text-gray-500 p-2">
                        {name}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

export default SimpleCalendar;
