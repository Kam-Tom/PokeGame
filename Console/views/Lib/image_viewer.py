import math
from PIL import Image
from textual import events
from textual.app import RenderResult
from textual.widget import Widget
from views.Lib.image_view import ImageView


def process_image(img):
    # Open the image

    # Convert the image to RGBA (if not already in that mode)
    img = img.convert("RGBA")

    # Get the image data
    data = img.getdata()

    # Create a new image with a white background
    new_data = []
    for item in data:
        # If the pixel is transparent, set it to white (255, 255, 255, 255)
        if item[3] == 0:
            new_data.append((255, 248, 220, 255))
        else:
            new_data.append(item)

    # Apply the new data to the image
    img.putdata(new_data)

    return img



class ImageViewer(Widget):

    def change_image(self,image:Image.Image) -> None:
        self.image = ImageView(process_image(image))
        self.image.set_container_size(self.tmp_w, self.tmp_h)
        self.on_show()


    def __init__(self, image: Image.Image,zoom_substract = 1):
        super().__init__()
        if not isinstance(image, Image.Image):
            raise TypeError(
                f"Expected PIL Image, but received '{type(image).__name__}' instead."
            )
        self.zoom_substract = zoom_substract
        self.tmp_w = self.size.width
        self.tmp_h = self.size.height
        self.image = ImageView(process_image(image))

    def on_show(self):
        w, h = self.size.width, self.size.height
        img_w, img_h = self.image.size

        # Compute zoom such that image fits in container
        zoom_w = math.log(max(w, 1) / img_w, self.image.ZOOM_RATE)
        zoom_h = math.log((max(h, 1) * 2) / img_h, self.image.ZOOM_RATE)
        zoom = max(0, math.ceil(max(zoom_w, zoom_h))) - self.zoom_substract

        self.image.set_zoom(zoom)

        # Position image in center of container
        img_w, img_h = self.image.zoomed_size
        self.image.origin_position = (-round((w - img_w) / 2), -round(h - img_h / 2))
        self.image.set_container_size(w, h, maintain_center=False)

        self.refresh()

    def on_resize(self, event: events.Resize):
        self.tmp_w = event.size.width
        self.tmp_h = event.size.height
        self.image.set_container_size(event.size.width, event.size.height)
        self.refresh()

    def render(self) -> RenderResult:
        return self.image