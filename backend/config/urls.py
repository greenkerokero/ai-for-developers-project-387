"""Root URL configuration."""

from django.urls import include, path, re_path
from django.http import FileResponse, HttpResponse
from django.conf import settings

def index_fallback(request, *args, **kwargs):
    index_path = settings.WHITENOISE_ROOT / "index.html"
    try:
        return FileResponse(open(index_path, "rb"))
    except FileNotFoundError:
        return HttpResponse("Frontend not built", status=404)

urlpatterns = [
    path("", include("booking_api.urls")),
    re_path(r"^.*$", index_fallback),
]
