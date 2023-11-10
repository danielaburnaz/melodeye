import json
import numpy as np
import matplotlib.pyplot as plt

def load_data(file_path):
    """Load dataset from a JSON file."""
    with open(file_path, 'r') as file:
        return json.load(file)

def process_eye_movement(dataset):
    """Process eye movement data."""
    left_eye_signals = []
    right_eye_signals = []

    for data_entry in dataset:
        for afe_entry in data_entry.get('afe', []):
            if afe_entry.get('t') == 'L':
                left_eye_signals.append(afe_entry['m'][0][:6])
            elif afe_entry.get('t') == 'R':
                right_eye_signals.append(afe_entry['m'][0][:6])

    avg_left_eye = np.mean(left_eye_signals, axis=0) if left_eye_signals else None
    avg_right_eye = np.mean(right_eye_signals, axis=0) if right_eye_signals else None

    return avg_left_eye, avg_right_eye

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
    data = [driving, indoor, walking]

    plt.figure(figsize=(10, 5))
    for i, scenario_data in enumerate(data):
        plt.subplot(1, 3, i + 1)
        if scenario_data is not None:
            plt.plot(scenario_data, label=scenarios[i])
        plt.title(f"{title} - {scenarios[i]}")
        plt.legend()
    plt.show()

# Process each scenario
driving_results = process_scenario('Driving_Scenario')
indoor_results = process_scenario('Indoor_Scenario')
walking_results = process_scenario('Walking_Scenario')

# Plot comparisons
plot_comparison(driving_results[0], indoor_results[0], walking_results[0], 'Eye Movement')
plot_comparison(driving_results[1], indoor_results[1], walking_results[1], 'Heart Rate')
plot_comparison(driving_results[2], indoor_results[2], walking_results[2], 'Ambient Light')
plot_comparison([driving_results[3]['avg_x'], driving_results[3]['avg_y'], driving_results[3]['avg_z']], 
                [indoor_results[3]['avg_x'], indoor_results[3]['avg_y'], indoor_results[3]['avg_z']], 
                [walking_results[3]['avg_x'], walking_results[3]['avg_y'], walking_results[3]['avg_z']], 
                'IMU Data')
