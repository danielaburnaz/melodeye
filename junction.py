import json
import numpy as np
import matplotlib.pyplot as plt

def load_data(file_path):
    """Load dataset from a JSON file."""
    with open(file_path, 'r') as file:
        return json.load(file)

def process_eye_movement(dataset):
    """Process eye movement data and extract timestamps."""
    left_eye_signals = []
    right_eye_signals = []
    timestamps = []  # List to hold timestamps

    for data_entry in dataset:
        for afe_entry in data_entry.get('afe', []):
            if 'm' in afe_entry and 'i' in afe_entry and afe_entry['m'][0][:6]:
                # Extract the timestamp, convert from microseconds to seconds
                timestamp = afe_entry['i'][1] / 1_000_000.0
                timestamps.append(timestamp)

                if afe_entry.get('t') == 'L':
                    left_eye_signals.append(afe_entry['m'][0][:6])
                elif afe_entry.get('t') == 'R':
                    right_eye_signals.append(afe_entry['m'][0][:6])

    # Convert to numpy arrays
    left_eye_signals = np.array(left_eye_signals)
    right_eye_signals = np.array(right_eye_signals)
    timestamps = np.array(timestamps)

    return left_eye_signals, right_eye_signals, timestamps


def calculate_average_heart_rate(heart_data):
    """Calculate the average heart rate."""
    heart_rates = [entry['hr'] for entry in heart_data if 'hr' in entry]
    return np.mean(heart_rates) if heart_rates else None

def read_ambient_conditions(aux_sensors):
    """Read ambient sensor data."""
    ambient_light_values = [entry['v'][2] for entry in aux_sensors if 'lightAmbient' in entry]
    average_ambient_light = np.mean(ambient_light_values) if ambient_light_values else None

    return average_ambient_light

def process_accelerometer_data(imu_data):
    """Process accelerometer data."""
    x_values, y_values, z_values = [], [], []

    for entry in imu_data:
        if entry['t'] == 'I':
            x, y, z = entry['v'][:3]
            x_values.append(x)
            y_values.append(y)
            z_values.append(z)

    avg_x = np.mean(x_values) if x_values else 0
    avg_y = np.mean(y_values) if y_values else 0
    avg_z = np.mean(z_values) if z_values else 0

    return {'avg_x': avg_x, 'avg_y': avg_y, 'avg_z': avg_z}

def process_scenario(scenario_path):
    afe_file = f"{scenario_path}/AFE_000_CONFIDENTIAL.json"  # Adjust the filename if needed
    imu_file = f"{scenario_path}/IMU_000_CONFIDENTIAL.json"  # Adjust the filename if needed

    afe_data = load_data(afe_file)
    imu_data = load_data(imu_file)

    eye_movement_results = process_eye_movement(afe_data)
    heart_rate_results = calculate_average_heart_rate(afe_data)
    ambient_conditions_results = read_ambient_conditions(afe_data)
    imu_results = process_accelerometer_data(imu_data)

    return eye_movement_results, heart_rate_results, ambient_conditions_results, imu_results

def plot_comparison(driving, indoor, walking, title):
    scenarios = ['Driving', 'Indoor', 'Walking']
    plt.figure(figsize=(15, 5))

    for i, scenario_data in enumerate([driving, indoor, walking]):
        left_eye_signals, right_eye_signals, timestamps = scenario_data
        plt.subplot(1, 3, i + 1)
        if left_eye_signals is not None and timestamps is not None:
            plt.plot(timestamps, left_eye_signals[:, 0], label=f'{scenarios[i]} Signal 1')  # Plotting only the first signal
            plt.xlabel('Time (seconds)')
            plt.ylabel('Signal Value')
            plt.title(f"{title} - {scenarios[i]}")
            plt.legend()

    plt.tight_layout()
    plt.show()


# Process each scenario
driving_results = process_scenario('Driving_Scenario')
indoor_results = process_scenario('Indoor_Scenario')
walking_results = process_scenario('Walking_Scenario')

# Plot comparisons
##This will give you plots for each scenario that show how the first signal from the left eye movement data changes over time. Remember to replace the scenario folder names with the correct paths to your data files.

plot_comparison(driving_results[0], indoor_results[0], walking_results[0], 'Eye Movement')

