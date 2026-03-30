# Relay Race Timer

A web-based timing application for relay races with precise hundredths of a second timing and comprehensive race management features.

## Features

- **Precise Timing**: Measures splits to hundredths of a second (00:00.00 format)
- **Relay Race Sequence**: Follows proper relay timing (first leg for all runners, then second leg, etc.)
- **Real-time Tracking**: Shows both individual leg times and cumulative race time
- **Race Management**: Start, next leg, undo, and reset functionality
- **Data Export**: Automatic CSV export with race results
- **Responsive Design**: Works on mobile and desktop devices

## Usage Instructions

### 1. Setting Up Runner Names
1. Enter names for all 5 runners in the input fields
2. Click "Save Names" to save the runner names
3. Names will be displayed in the runner cards during the race

### 2. Starting the Race
1. Click "Next Leg" to begin the race
2. The timer will start automatically
3. The first runner begins their first leg

### 3. Timing Progression
1. **Next Leg**: Advances to the next runner in the current leg
2. **Race Time**: Continuously updates showing total race time
3. **Split Times**: Show individual leg times for each runner

### 4. Race Completion
1. The race automatically completes after Runner 5 finishes Leg 8
2. "Next Leg" button becomes disabled
3. Popup notification appears
4. Automatic CSV export with race results

### 5. Race Management
- **Oops**: Undo the last "Next Leg" action
- **Reset Race**: Clear all data and start over (with confirmation)

## Time Format

All times are displayed in `MM:SS.CC` format:
- **MM**: Minutes (00-99)
- **SS**: Seconds (00-59) 
- **CC**: Hundredths of a second (00-99)

## CSV Export Format

The application exports a CSV file with the following structure:

```
Runner Name,Leg 1,Leg 2,Leg 3,Leg 4,Leg 5,Leg 6,Leg 7,Leg 8,Total Time
"Runner 1","00:45.23","00:47.65","00:46.32","00:48.15","00:47.89","00:46.78","00:48.21","00:47.93","05:12.45"
"Runner 2","00:47.65","00:45.23","00:48.15","00:46.32","00:47.89","00:46.78","00:48.21","00:47.93","05:12.45"
...
```

## Keyboard Shortcuts

- **Enter/Right Arrow**: Next Leg
- **Left Arrow**: Oops (undo last action)
- **Spacebar**: Free for runner names (not used for timing)

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No installation required - works directly in the browser

## Browser Support

This application is designed to work on:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+

## Offline Support

The application supports Progressive Web App (PWA) features:
- Can be installed on devices
- Works offline after initial load
- Automatic updates

## Privacy

This application runs entirely in your browser - no data is sent to any servers. All timing data is stored locally in your browser.

## License

MIT License - feel free to use, modify, and distribute.