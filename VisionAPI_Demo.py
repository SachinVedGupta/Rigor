import os
import io
from google.cloud import vision
from google.cloud.vision_v1 import types
import requests
import cv2
from flask import Flask, render_template



def get_nutritional_info(food_name, api_key):
    base_url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {
        "query": food_name,
        "api_key": api_key,
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        if 'foods' in data and data['foods']:
            first_food = data['foods'][0]
            return first_food
        else:
            return None
    else:
        print(f"Error: {response.status_code}")
        print(response.text)  # Print the response content for more details
        return None
    


def print_nutrition_info(chosen_food):
    # Replace 'your_usda_api_key' with your actual USDA API key
    # Replace 'your_usda_api_key' with your actual USDA API key
  api_key = 'zPT7C4TPjDGgQ2IZcCNwOwPihzfpFrGBauRWlfYa'
  food_name = chosen_food

  result = get_nutritional_info(food_name, api_key)

  output = []

  if result and 'foodNutrients' in result:
      for nutrient in result['foodNutrients']:
          output.append(f"{nutrient['nutrientName']}: {nutrient['value']} {nutrient['unitName']}")

  return output if output else False



def camera():
  cam = cv2.VideoCapture(0)

  cv2.namedWindow("Rigor Camera")


  while True:
    ret,frame = cam.read()

    if not ret:
      print("No Picture")
      break

    cv2.imshow("test", frame)

    k = cv2.waitKey(1)

    if k%256 == 27:
      print("Leaving")
      cam.release()
      break
    elif k%256 == 32:
      img_name = "food_picture.png"
      cv2.imwrite(img_name,frame)
      print("Image Taken")
      print("Leaving")
      cam.release()
      break
      

  cam.release()
  return 0

camera()
INPUT_PICTURE = "food_picture" + ".png"



# Set the path to your service account key JSON file
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'ServiceAccountToken.json'

# Create a Google Cloud Vision API client
client = vision.ImageAnnotatorClient()

# Specify the name of the image file
#file_name = 'Blank.jpg'
file_name = INPUT_PICTURE

# Corrected folder structure
image_path = os.path.abspath(os.path.join(file_name))

try:
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    # Create a Vision API image object
    image = types.Image(content=content)

    # Perform label detection on the image
    response = client.label_detection(image=image)

    Total_Calories_List_Strings = []
    Total_Calories_Count = 0
    Total_Protein_List_Strings = []
    Total_Protein_Count = 0
    Total_Fat_List_Strings = []
    Total_Fat_Count = 0

    # Extract and print labels from the response
    labels = response.label_annotations
    print("Loading :)")
    for label in labels:
        if print_nutrition_info(label) != False:
            #print(print_nutrition_info(label))
            Energy = " "
            Energy = [i for i in print_nutrition_info(label) if "Energy:" and "KCAL" in i]
            StringEnergy = '\n'.join(Energy)
            StrippedEnergy = StringEnergy.strip().strip("KCAL").strip("Energy:")
            NumEnergy = float(StrippedEnergy)
            Total_Calories_Count += NumEnergy
            Total_Calories_List_Strings.append(NumEnergy)

            Protein = " "
            Protein = [i for i in print_nutrition_info(label) if "Protein:" in i]
            StringProtein = '\n'.join(Protein)
            StrippedProtein = StringProtein.strip().strip("G").strip("Protein: ")
            NumProtein = float(StrippedProtein)
            Total_Protein_Count += NumProtein
            Total_Protein_List_Strings.append(NumProtein)

            Fat = " "
            Fat = [i for i in print_nutrition_info(label) if "fat" in i]
            StringFat = '\n'.join(Fat)
            StrippedFat = StringFat.strip().strip("G").strip("Total lipid (fat): ")
            NumFat = float(StrippedFat)
            Total_Fat_Count += NumFat
            Total_Fat_List_Strings.append(NumFat)

    print(Total_Calories_List_Strings)
    print("\nThe total calories are:", round(Total_Calories_Count, 2), "KCAL")

    print(Total_Protein_List_Strings)
    print("\nThe total protein is:", round(Total_Protein_Count, 2), "g")

    print(Total_Fat_List_Strings)
    print("\nThe total fat is:", round(Total_Fat_Count, 2), "g")


    app = Flask(__name__)

    @app.route('/')
    def hello_world():
        greeting_message = "Hello, World!"
        return render_template('indextwo.html', greeting=greeting_message)

    if __name__ == '__main__':
        app.run(debug=True)



except FileNotFoundError:
    print(f"Error: File not found at path {image_path}")
except Exception as e:
    print(f"Error: {e}")







